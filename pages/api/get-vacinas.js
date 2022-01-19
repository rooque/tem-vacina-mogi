import axios from "axios";
import cache from "memory-cache";
const https = require("https");
import { stripHtml } from "string-strip-html";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

axios.defaults.timeout = 1000 * 10;

export default async (req, res) => {
  const data = await cachedGetVacinas();
  res.statusCode = data ? 200 : 500;
  res.json(data);
};

export const cachedGetVacinas = async () => {
  const cached = cache.get("vacinas");
  if (cached) return cached;
  const data = await getVacinas();
  data && saveCacheVacina(data);
  if (!data) return cache.get("vacinas.old");
  return data;
};

const saveCacheVacina = (data) => {
  cache.put("vacinas", data, 1000 * 4);
  cache.put("vacinas.old", data, 1000 * 60 * 60);
};

export const getVacinas = async () => {
  try {
    const api = await axios.get(
      "https://vacina.mogidascruzes.sp.gov.br/servicos-listar",
      { httpsAgent: agent }
    );
    const data = api.data.map(transformVacina);
    return data;
  } catch (error) {
    return null;
  }
};

const transformVacina = (vacina) => {
  const primeiraDose =
    vacina.informativo.toLowerCase().indexOf("n") !== -1;
  const segundaDose =
    false;
  const comorbidades =
    false;

  if (!primeiraDose && !segundaDose) {
    return {
      id: vacina.id,
      nome: vacina.titulo,
      informativo: vacina.informativo,
      primeiraDose: null,
      idade: null,
      total: null,
      data: null,
      descricao: stripHtml(vacina.descricao).result,
    };
  }
  const nome = getVacinaName(vacina);
  const data = primeiraDose ? null : getVacinaData(vacina);
  return {
    id: vacina.id,
    nome,
    primeiraDose,
    comorbidades,
    idade: vacina.idade_minima,
    total: vacina.total,
    data,
    descricao: null,
  };
};

const getVacinaName = (vacina) => {
  if (vacina.titulo.toLowerCase().indexOf("pfizer") !== -1) return "PFizer";
  if (vacina.titulo.toLowerCase().indexOf("astrazeneca") !== -1)
    return "Astrazeneca";
  if (vacina.titulo.toLowerCase().indexOf("coronavac") !== -1)
    return "Coronavac";
  if (vacina.titulo.toLowerCase().indexOf("janssen") !== -1) return "Janssen";
  return vacina.titulo;
};

const getVacinaData = (vacina) => {
  const data = vacina.titulo.match(
    /((?=\d{4})\d{4}|(?=[a-zA-Z]{3})[a-zA-Z]{3}|\d{2})((?=\/)\/|\-)((?=[0-9]{2})[0-9]{2}|(?=[0-9]{1,2})[0-9]{1,2}|[a-zA-Z]{3})((?=\/)\/|\-)((?=[0-9]{4})[0-9]{4}|(?=[0-9]{2})[0-9]{2}|[a-zA-Z]{3})/g
  );
  return data[0];
};
