import {defineConfig} from "umi";

const {UMI_ENV = ''} = process.env;
console.log('UMI_ENV', UMI_ENV);

function OutputPathName(env: string) {
  if (env) {
    return `${env}-dist`
  }
  return 'dist'
}

export default defineConfig({

  favicons: [
    '/favicon.ico',
    '/favicon.svg'
  ],
  model: {},
  dva: {},
  request: {dataField: 'data'},
  title: 'Aki Network | BRC20 Marketplace',
  routes: [
    {path: "/", component: "genesisPassport"},
    {path: "/discover", component: "discover"},
    {path: "/profile", component: "profile"},
    {path: "/inscriptions", component: "inscriptions"},
    {path: "/inscribe", component: "inscribe"},
    {path: "/index", component: "@/pages/index/index"},
    {path: "/index/tick", component: "@/pages/index/tick/index"},
    {path: "/inscribeOrders", component: "inscribeOrders"},
    {path: "/genesisPassport", component: "genesisPassport"},
  ],
  npmClient: "yarn",
  // mock: false,
  history: {
    type: 'hash'
  },
  publicPath: '/',

  esbuildMinifyIIFE: true,
  scripts: [],
  hash: true,
  outputPath: OutputPathName(UMI_ENV),
  locale: {
    baseNavigator: true,
    baseSeparator: '-',
    default: 'en-US',
    // default: 'ja',
    title: true,
    useLocalStorage: true,
  },
});
