import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Text,
  Radio,
  RadioGroup,
  Stack,
  CheckboxGroup,
  Checkbox,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";

export const MenuDrawer = ({ isOpen, onClose, state, setState, play }) => (
  <>
    <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Configurações</DrawerHeader>
        <DrawerBody>
          <Text fontSize="md">Doses</Text>
          <Text fontSize="md" mt="5">
            Vacinas
          </Text>
          <CheckboxGroup
            mt="2"
            onChange={(v) => {
              setState((d) => {
                d.vacinas = v;
              });
            }}
            value={state.vacinas}
          >
            <Stack direction="column" mt="2">
              <Checkbox value="pfizer">PFizer</Checkbox>
              <Checkbox value="astrazeneca">Astrazeneca</Checkbox>
              <Checkbox value="coronavac">Coronavac</Checkbox>
              <Checkbox value="janssen">Janssen</Checkbox>
              <Checkbox value="avisos">Avisos</Checkbox>
            </Stack>
          </CheckboxGroup>
          <Stack direction="row" mt="5">
            <Text fontSize="md">Aviso Sonoro</Text>
            <Text fontSize="xs">Beta</Text>
            <Popover>
              <PopoverTrigger>
                <QuestionOutlineIcon cursor="pointer" />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  O Aviso Sonoro é um som que é executado quando qualquer vacina
                  possuir vaga. Os filtros acima são considerados para esse
                  aviso.
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Stack>
          <RadioGroup
            mt="2"
            onChange={(v) => {
              setState((d) => {
                d.alerta = v;
              });
            }}
            value={state.alerta}
          >
            <Stack direction="column">
              <Radio value="off">Desligado</Radio>
              <Radio value="on">Ligado</Radio>
            </Stack>
          </RadioGroup>
          <Button
            onClick={play}
            colorScheme="blue"
            variant="outline"
            mt="5"
            size="sm"
          >
            Testar aviso
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  </>
);
