import type { StructureResolver } from "sanity/structure";

/** The Studio sidebar, in the order editors use it most. Contact details open as a single form. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("QADCO website")
    .items([
      S.documentTypeListItem("project").title("Projects with photos"),
      S.documentTypeListItem("registerEntry").title("Project register"),
      S.documentTypeListItem("tower").title("Skyline towers"),
      S.documentTypeListItem("brand").title("Brands"),
      S.divider(),
      S.listItem()
        .title("Contact details")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Contact details")),
    ]);
