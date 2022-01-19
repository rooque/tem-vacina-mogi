import {
  Alert,
  AlertIcon,
  AlertTitle,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";

export const AvisoView = ({aviso}) => {
  return (
    <>
      <Alert
        status="warning"
        marginY="5"
        alignItems="center"
        justifyContent="center"
      >
        <AlertIcon />
        <Popover strategy="fixed">
          <PopoverTrigger>
            <AlertTitle
              fontWeight="bold"
              cursor="pointer"
              textDecor="underline"
            >
              {aviso.nome.replace(":", "")}
            </AlertTitle>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>{aviso.descricao}</PopoverBody>
          </PopoverContent>
        </Popover>
      </Alert>
    </>
  );
};
