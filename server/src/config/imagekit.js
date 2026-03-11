import config from "./config.js";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: config.imagekitPublicKey,
  privateKey: config.imagekitPrivateKey,
  urlEndpoint: config.imagekitUrlEndpoint,
});

export default imagekit;