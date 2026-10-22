/**
 * Zips a folder for Linux hosting (Bluehost cPanel "Extract"): forward-slash paths, folder
 * entries, and Unix permissions (folders 755, files 644). Windows' own zip tool stores
 * backslashes and no permissions, which leaves folders unreadable on the server.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { crc32, deflateRawSync } from "node:zlib";

/** DOS date/time fields for a zip entry. */
function dosTime(d) {
  return {
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2),
    date: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  };
}

export function zipDir(dir, outFile) {
  const entries = [];
  const walk = (abs, rel) => {
    for (const name of readdirSync(abs).sort()) {
      const a = path.join(abs, name);
      const r = rel ? `${rel}/${name}` : name;
      if (statSync(a).isDirectory()) {
        entries.push({ name: `${r}/`, dir: true, mtime: statSync(a).mtime });
        walk(a, r);
      } else {
        entries.push({ name: r, dir: false, data: readFileSync(a), mtime: statSync(a).mtime });
      }
    }
  };
  walk(dir, "");

  const chunks = [];
  const central = [];
  let offset = 0;
  for (const e of entries) {
    const name = Buffer.from(e.name, "utf8");
    const raw = e.dir ? Buffer.alloc(0) : e.data;
    const packed = e.dir ? raw : deflateRawSync(raw, { level: 9 });
    const method = e.dir ? 0 : 8;
    const crc = e.dir ? 0 : crc32(raw);
    const { time, date } = dosTime(e.mtime);
    const mode = e.dir ? 0o40755 : 0o100644;

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0x0800, 6); // UTF-8 names
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(packed.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    chunks.push(local, name, packed);

    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0);
    cen.writeUInt16LE((3 << 8) | 20, 4); // made by Unix, so the permissions below are honoured
    cen.writeUInt16LE(20, 6);
    cen.writeUInt16LE(0x0800, 8);
    cen.writeUInt16LE(method, 10);
    cen.writeUInt16LE(time, 12);
    cen.writeUInt16LE(date, 14);
    cen.writeUInt32LE(crc, 16);
    cen.writeUInt32LE(packed.length, 20);
    cen.writeUInt32LE(raw.length, 24);
    cen.writeUInt16LE(name.length, 28);
    cen.writeUInt16LE(0, 30);
    cen.writeUInt16LE(0, 32);
    cen.writeUInt16LE(0, 34);
    cen.writeUInt16LE(0, 36);
    cen.writeUInt32LE(((mode << 16) | (e.dir ? 0x10 : 0)) >>> 0, 38);
    cen.writeUInt32LE(offset, 42);
    central.push(cen, name);

    offset += local.length + name.length + packed.length;
  }

  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  writeFileSync(outFile, Buffer.concat([...chunks, centralBuf, end]));
  return entries.length;
}
