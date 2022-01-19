import {
  MoonIcon,
  QuestionOutlineIcon,
  SettingsIcon,
  SunIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Center,
  Container,
  Divider,
  Fade,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { getAnalytics } from "firebase/analytics";
import { getApp, initializeApp } from "firebase/app";
import debounce from "lodash.debounce";
import { useEffect } from "react";
import useSWR from "swr";
import { useImmer } from "use-immer";
import useSound from "use-sound";
import {
  AvisoView,
  EmptyStateView,
  ErrorView,
  HomeHeader,
  InfoModal,
  MadeWithLove,
  MenuDrawer,
  VacinaView,
} from "../components";
import { firebaseConfig } from "../firebaseConfig";
import { callWithTimeout, fetcher } from "../shared/utils";
import { cachedGetVacinas } from "./api/get-vacinas";

export async function getServerSideProps() {
  try {
    const vacinas = await callWithTimeout(cachedGetVacinas, 4000);
    return { props: { vacinas } };
  } catch (error) {
    return { props: { vacinas: null } };
  }
}

const defaultState = {
  dose: "todas",
  vacinas: ["avisos", "pfizer", "astrazeneca", "coronavac", "janssen"],
  alerta: "off",
};

export default function Home({ vacinas = null }) {
  // SWR
  const { data, error, isValidating } = useSWR("/api/get-vacinas", fetcher, {
    refreshInterval: 5000,
    fallbackData: vacinas,
    refreshWhenHidden: true,
  });

  // Theme
  const { colorMode, toggleColorMode } = useColorMode();
  const darkMode = colorMode === "dark";
  const ThemeIcon = darkMode ? SunIcon : MoonIcon;

  // Open/Close
  const {
    isOpen: isModalOpen,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();

  // Sound
  const [play] = useSound("/cool_beep_ever.mp3", {
    volume: 0.7,
  });

  const slowPlay = debounce(play, 1000, { trailing: false, leading: true });

  // State
  const [state, setState] = useImmer(defaultState);
  const [filteredData, setFilteredData] = useImmer(data);
  const [analytics, setAnalytics] = useImmer(null);
  const [avisos, setAvisos] = useImmer([]);

  // Filter
  useEffect(() => {
    let filtered = [];

    if (data === null || data === undefined) return setFilteredData(null);

    filtered = data;

    if (filtered === null || filtered === undefined) return setFilteredData([]);

    filtered = filtered.filter((v) =>
      state.vacinas.includes(v.nome.toLowerCase())
    );

    if (state.vacinas.includes("avisos")) {
      const avisos = data.filter((v) => v.informativo);
      if (avisos && avisos.length > 0) setAvisos(avisos);
      else setAvisos([]);
    } else {
      setAvisos([]);
    }

    setFilteredData(filtered);
  }, [state, data]);

  // Aviso
  useEffect(() => {
    if (filteredData === null || filteredData === undefined) return;
    const anyVacina = filteredData.filter((v) => v.total > 0).length > 0;
    if (state.alerta === "on" && anyVacina) {
      slowPlay();
    }
  }, [filteredData, state.alerta]);

  // GA
  useEffect(() => {
    try {
      const app = getApp();
      setAnalytics(getAnalytics(app));
    } catch (error) {
      const firebase = initializeApp(firebaseConfig);
      setAnalytics(getAnalytics(firebase));
    }
  }, []);

  const cleanFilters = () => {
    setState((d) => {
      d.dose = defaultState.dose;
      d.vacinas = defaultState.vacinas;
    });
  };

  return (
    <>
      <Container maxW="container.xl">
        <HomeHeader />
        <Center padding="3">
          <Stack>
            <Stack direction="row" alignItems="center">
              <Heading color={darkMode ? "gray.100" : "gray.700"}>
                Tem vacina?
              </Heading>
            </Stack>
            <Text textAlign="center" fontSize="xl" color="gray.700">
              <SettingsIcon
                color={darkMode ? "gray.100" : "gray.700"}
                cursor="pointer"
                onClick={onOpenDrawer}
                w={6}
                h={6}
              />
              <ThemeIcon
                color={darkMode ? "gray.100" : "gray.700"}
                ml="5"
                cursor="pointer"
                w={6}
                h={6}
                onClick={toggleColorMode}
              />
              <QuestionOutlineIcon
                color={darkMode ? "gray.100" : "gray.700"}
                ml="5"
                cursor="pointer"
                w={6}
                h={6}
                onClick={onOpenModal}
              />
            </Text>
          </Stack>
        </Center>
        <Center padding="3">
          <Divider />
        </Center>
        {!error && !filteredData && (
          <Center padding="5">
            <Spinner />
          </Center>
        )}

        {error && !filteredData && <ErrorView />}

        {avisos &&
          avisos.length > 0 &&
          avisos.map((v) => <AvisoView aviso={v} />)}

        {filteredData && filteredData.length === 0 && (
          <EmptyStateView onClick={cleanFilters} />
        )}

        {filteredData && (
          <SimpleGrid
            columns={filteredData.length === 1 ? 1 : [2, 2, 3]}
            spacing={4}
          >
            {filteredData.map((v) => (
              <VacinaView
                key={v.id}
                name={v.nome}
                qtd={v.total}
                primeiraDose={v.primeiraDose}
                idade={v.idade}
                data={v.data}
                descricao={v.descricao}
                comorbidades={v.comorbidades}
                darkMode={darkMode}
                analytics={analytics}
              />
            ))}
          </SimpleGrid>
        )}
        <Box zIndex="modal" h="spinner.size" pos="fixed" right="5" bottom="5">
          <Box pos="relative" h="spinner.size" textAlign="right">
            <Fade in={isValidating && data}>
              <Spinner />
            </Fade>
          </Box>
        </Box>
        <MadeWithLove />
      </Container>
      <MenuDrawer
        isOpen={isDrawerOpen}
        onClose={onCloseDrawer}
        state={state}
        setState={setState}
        play={slowPlay}
      />
      <InfoModal isOpen={isModalOpen} onClose={onCloseModal} />
    </>
  );
}
