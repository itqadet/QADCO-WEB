import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href } from "@/i18n/routing";
import { ButtonLink, ButtonRow } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default async function NotFound() {
  const [{ notFound }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <Container style={{ paddingBlock: "var(--section)" }}>
      <h1>{notFound.title}</h1>
      <p>{notFound.body}</p>
      <ButtonRow>
        <ButtonLink href={href(locale)}>{notFound.action}</ButtonLink>
      </ButtonRow>
    </Container>
  );
}
