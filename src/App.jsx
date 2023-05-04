import QRCode from "qrcode";
import { useRef, useState } from "react";
import ICON from "./assets/下载.svg";

function App() {
  const [showResult, setShowResult] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState();
  const canvasRef = useRef();
  const textRef = useRef();
  const prevTextRef = useRef();

  // settings
  const errorCorrectionLevelRef = useRef();
  const maskPatternRef = useRef();
  const marginRef = useRef();
  const scaleRef = useRef();
  const smallRef = useRef();
  const widthRef = useRef();
  const colorDarkRef = useRef();
  const colorLightRef = useRef();
  const qualityRef = useRef();
  const [type, setType] = useState("image/png");

  function getNewOptions() {
    const options = {
      errorCorrectionLevel: errorCorrectionLevelRef.current?.value,
      // maskPattern: maskPatternRef.current
      margin: +marginRef.current?.value,
      scale: +scaleRef.current?.value,
      small: smallRef.current?.checked,
      width: +widthRef.current?.value,
      color: {
        dark: colorDarkRef.current?.value,
        light: colorLightRef.current?.value,
      },
      type,
      rendererOpts: {
        quality: qualityRef.current?.value / 100,
      },
    };
    if (maskPatternRef.current && maskPatternRef.current.value !== "") {
      options.maskPattern = +maskPatternRef.current?.value;
    }
    return options;
  }

  async function generateQR(text) {
    const options = getNewOptions();
    console.log(options);
    prevTextRef.current = text;
    try {
      await QRCode.toCanvas(canvasRef.current, text, options);
      download(options.type);
    } catch (err) {
      console.error(err);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const value = textRef.current.value.trim();

    if (value === "") return;

    generateQR(value);

    textRef.current.value = "";

    setShowResult(true);
  }

  async function download(type) {
    let options = getNewOptions();
    options = { ...options, type };
    if (type.includes("image")) {
      setDownloadUrl(await QRCode.toDataURL(prevTextRef.current, options));
    } else {
      let source = await QRCode.toString(prevTextRef.current, options);

      // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
      if (
        !source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)
      ) {
        source = source.replace(
          /^<svg/,
          '<svg xmlns="http://www.w3.org/2000/svg"'
        );
      }
      if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(
          /^<svg/,
          '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
        );
      }

      //add xml declaration
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

      //convert svg source to URI data scheme.
      const url =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

      setDownloadUrl(url);
    }
  }
  return (
    <>
      <div className=" bg-slate-50 min-h-screen">
        <header className="bg-red-200 flex items-center justify-center md:justify-start md:pl-28 gap-4 p-8 shadow mb-8 md:text-left text-lg">
          <p>QR Code Generator</p>
          <img src={ICON} alt="ICON" className=" w-12" />
        </header>

        <div className="md:flex md:justify-evenly">
          {/* general setting */}
          <div className="p-4 px-8 flex flex-col gap-2">
            <p className="text-center mb-4 text-xl">General Setting</p>
            {/* errorCorrectionLevel */}
            <div className="flex justify-between gap-8">
              <label htmlFor="errorCorrectionLevel">errorCorrectionLevel</label>
              <select
                defaultValue="M"
                ref={errorCorrectionLevelRef}
                name="errorCorrectionLevel"
                id="errorCorrectionLevel"
              >
                <option value="H">High</option>
                <option value="Q">quartile</option>
                <option value="M">Medium</option>
                <option value="L">Low</option>
              </select>
            </div>
            {/* maskPattern */}
            <div className="flex justify-between">
              <label htmlFor="maskPattern">maskPattern</label>
              <select
                defaultValue=""
                ref={maskPatternRef}
                name="maskPattern"
                id="maskPattern"
              >
                <option value="">default</option>
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
              </select>
            </div>
            {/* margin */}
            <div className="flex justify-between">
              <label htmlFor="margin">margin </label>
              <input
                className="text-center"
                type="number"
                defaultValue={4}
                ref={marginRef}
                id="margin"
              />
            </div>
            {/* scale */}
            <div className="flex justify-between">
              <label htmlFor="scale">scale</label>
              <input
                ref={scaleRef}
                type="number"
                className="text-center"
                defaultValue={4}
                id="scale"
              />
            </div>
            {/* small */}
            <div className="flex justify-between">
              <label htmlFor="small">small</label>
              <input type="checkbox" disabled ref={smallRef} id="scale" />
            </div>
            {/* width */}
            <div className="flex justify-between gap-4">
              <label htmlFor="width">width px</label>
              <input
                type="number"
                className="text-center"
                defaultValue={120}
                ref={widthRef}
                id="scale"
              />
            </div>
            {/* color.dark */}
            <div className="flex justify-between">
              <label htmlFor="color.dark">color.dark</label>
              <input
                type="color"
                defaultValue="#000000"
                ref={colorDarkRef}
                id="color.dark"
              />
            </div>
            {/* color.light */}
            <div className="flex justify-between">
              <label htmlFor="color.light">color.light</label>
              <input
                type="color"
                defaultValue="#ffffff"
                ref={colorLightRef}
                id="color.light"
              />
            </div>
            {/* Download Image Only */}
            <p className="text-center mt-2">Download Image Only</p>
            {/* rendererOpts.quality */}
            <div className="flex flex-col">
              <label htmlFor="quality">quality (between 0 and 1)</label>
              <input
                type="range"
                defaultValue={92}
                ref={qualityRef}
                id="scale"
              />
            </div>
          </div>
          <div>
            {/* input */}
            <form onSubmit={handleSubmit} className="p-8">
              <input
                className="w-full px-4 py-2 shadow"
                type="text"
                placeholder="enter text"
                ref={textRef}
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-red-200 rounded mt-4 active:scale-95"
              >
                genarate QR Code
              </button>
            </form>

            {/* output */}
            <div className="p-8 sm:flex justify-evenly items-center">
              <canvas
                className="mb-4 mx-auto sm:mx-0 max-w-xs max-h-80 aspect-square"
                ref={canvasRef}
              ></canvas>

              {showResult && (
                <div className="flex justify-center items-center gap-1 mb-4">
                  <a
                    href={downloadUrl}
                    className="px-4 cursor-pointer py-2 bg-red-200 rounded active:scale-95"
                    download
                  >
                    Download
                  </a>
                  <select
                    className="bg-red-200 p-2 rounded"
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                      download(e.target.value);
                    }}
                  >
                    <option value="image/png">png</option>
                    <option value="image/jpeg">jpeg</option>
                    <option value="image/webp">webp</option>
                    <option value="svg">svg</option>
                    <option value="terminal" className=" bg-slate-200" disabled>
                      terminal
                    </option>
                    <option value="utf8" className=" bg-slate-200" disabled>
                      utf8
                    </option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
        <footer className="p-8 sm:p-12 lg:px-20 xl:px-44">
          <h1 className=" border-b-2 text-xl font-medium py-4">
            Error correction level
          </h1>
          <p className="mt-4">
            Error correction capability allows to successfully scan a QR Code
            even if the symbol is dirty or damaged. Four levels are available to
            choose according to the operating environment.
          </p>
          <p className="mt-4">
            Higher levels offer a better error resistance but reduce the
            symbol's capacity. If the chances that the QR Code symbol may be
            corrupted are low (for example if it is showed through a monitor) is
            possible to safely use a low error level such as Low or Medium.
          </p>

          <h1 className=" border-b-2 text-xl font-medium py-4">Mask Pattern</h1>
          <p className="mt-4"> Mask pattern used to mask the symbol. </p>

          <h1 className=" border-b-2 text-xl font-medium py-4">Margin</h1>
          <p className="mt-4">Define how much wide the quiet zone should be.</p>

          <h1 className=" border-b-2 text-xl font-medium py-4">Scale</h1>
          <p className="mt-4">
            Scale factor. A value of 1 means 1px per modules (black dots).
          </p>
          <h1 className=" border-b-2 text-xl font-medium py-4">Small</h1>
          <p className="mt-4">
            Relevant only for terminal renderer. Outputs smaller QR code.
          </p>
          <h1 className=" border-b-2 text-xl font-medium py-4">Width</h1>
          <p className="mt-4">Forces a specific width for the output image.</p>
          <p className="mt-4">
            If width is too small to contain the qr symbol, this option will be
            ignored. Takes precedence over scale.
          </p>
          <h1 className=" border-b-2 text-xl font-medium py-4">Color.Dark</h1>
          <p className="mt-4">
            Color of dark module. Value must be in hex format (RGBA).
          </p>
          <p className="mt-4">
            Note: dark color should always be darker than color.light.
          </p>
          <h1 className=" border-b-2 text-xl font-medium py-4">Color.Light</h1>
          <p className="mt-4">
            Color of light module. Value must be in hex format (RGBA).
          </p>
          <h1 className=" border-b-2 text-xl font-medium py-4">Quality</h1>
          <p className="mt-4">
            A Number between 0 and 1 indicating image quality if the requested
            type is image/jpeg or image/webp.
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
