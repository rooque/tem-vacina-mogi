import { Container, Text } from "@chakra-ui/react";

export const MadeWithLove = () => {
  return (
    <Container centerContent p="5">
      <Text>
        Made with <span style={{ color: "#e25555" }}>&hearts;</span> by{" "}
        <Text as="a" href="https://github.com/rooque" target="_blank">
          rooque
        </Text>
      </Text>
    </Container>
  );
};
