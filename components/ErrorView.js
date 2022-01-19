import { Center, Spinner, Text } from "@chakra-ui/react";

export const ErrorView = () => {
  return (
    <>
      <Center padding="5">
        <Text fontSize="xl">Opss..</Text>
      </Center>
      <Center padding="5">
        <Text fontSize="md">
          Estamos com problemas para carregar as vacinas.
        </Text>
      </Center>
      <Center padding="5">
        <Text fontSize="md">
          <Spinner />
        </Text>
      </Center>
    </>
  );
};
