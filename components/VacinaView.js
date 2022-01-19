import { Container, Stack, Tag, Text } from "@chakra-ui/react";
import { logEvent } from "@firebase/analytics";

const openSite = () => {
  window.open("https://vacina.mogidascruzes.sp.gov.br/");
};

export const VacinaView = ({
  id,
  name,
  qtd,
  primeiraDose,
  idade,
  data,
  darkMode,
  descricao,
  comorbidades,
  analytics,
}) => (
  <>
    <Container
      key={id}
      display="flex"
      flexDirection="column"
      boxShadow="lg"
      justifyContent="space-around"
      align="start"
      onClick={() => {
        analytics &&
          logEvent(analytics, "click", {
            id,
            name,
            qtd,
            primeiraDose,
            idade,
            data,
            darkMode,
            comorbidades,
            descricao,
          });
        openSite();
      }}
      cursor="pointer"
      padding="5"
      borderRadius="lg"
      bg={
        qtd > 0
          ? darkMode
            ? "green.700"
            : "green.300"
          : darkMode
          ? "gray.700"
          : "gray.300"
      }
    >
      <Container>
        <Text fontSize="xl" isTruncated>
          {name}
        </Text>
        <Stack direction={["column", "row"]} mt="1">
          <Tag isTruncated size="sm" bg={darkMode ? "black" : "white"}>
            {idade}+
          </Tag>
        </Stack>
      </Container>
      <Container>
        <Text fontSize="3xl" isTruncated>
          {qtd}
        </Text>
        <Text fontSize="sm" isTruncated>
          vagas
        </Text>
      </Container>
    </Container>
  </>
);
