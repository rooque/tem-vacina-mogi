import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

export const InfoModal = ({ isOpen, onClose }) => (
  <>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sobre</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="md">
            Veja as vacinas disponíveis de Mogi das Cruzes em tempo real.
            Liberou? Só clicar na vacina e você é redirecionado para a página de
            agendamento da prefeitura.
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  </>
);
