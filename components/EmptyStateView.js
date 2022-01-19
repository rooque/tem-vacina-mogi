import { Button, Center, Text } from "@chakra-ui/react";

export const EmptyStateView = ({ onClick }) => {
  return (
    <>
      <Center padding="5">
        <Text fontSize="xl">Nenhuma vacina encontrada</Text>
      </Center>
      <Center padding="5">
        <Button onClick={onClick}>Limpar filtros</Button>
      </Center>
    </>
  );
};
