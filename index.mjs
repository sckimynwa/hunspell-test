import { loadModule } from "hunspell-asm";
import fs from 'fs';
import { spawn } from 'child_process';

let hunspellFactory;
let checker;

let tempStore = {};

function extractAndReplace(text) {
  let count = 0;

  const replacer = (match) => {
    const key = `@@${count}@@`;
    tempStore[key] = match;
    count++;
    return key;
  };

  // Extract HTML tags, URLs, LaTeX and replace them with placeholders
  text = text.replace(/<.*?>/g, replacer);
  text = text.replace(/\$.*?\$/g, replacer);

  return text;
}

function restoreText(text) {
  for (const [key, value] of Object.entries(tempStore)) {
    text = text.replace(new RegExp(key, 'g'), value);
  }
  return text;
}

main();

async function main () {
  await initialize();
  const rawSentence = `<body>0 $41$ $y = - \\frac { 1 } { 3 } x + 1$ 의 그래프의 $x$ 절편은 $3,$ $y = - 3x + 2$ 의 그래프 의 $y - $ 절편은 $2 - $ 이므로 $y = mx + n$ 의 그래프의 $x = $ 절편은 $3,$ $y$ 절편 은 $2$ 이다. 즉, $y = mx + n$ 의 그래프가 두 점 $ ( 3,$ $0 ) $ $ ( 0,2 ) $ 를 지나므로 $m = \\frac { 2 - 0 } { 0 - 3 } = - \\frac { 2 } { 3 } ,$ $,n = 2$ $ \\frac { n } { m } = 2 \\div ( - \\frac { 2 } { 3 } ) = 2 \\times ( - \\frac { 3 } { 2 } ) = - 3$ B $ \\textcircled { 1 } $</body>$hello world$더이상조슈아는내말을듣지않지.안녕하세요.저는한국인입니다데이터팜에서띄어쓰기가제대로안된다는소식을듣고테스트를한번해보려고해요.`.replace(/' '/g, '');
  tempStore = {}; // Reset tempStore

  // Extract and replace
  const sentence = extractAndReplace(rawSentence);
  // const sentence = `더이상조슈아는내말을듣지않지.안녕하세요.저는한국인입니다데이터팜에서띄어쓰기가제대로안된다는소식을듣고테스트를한번해보려고해요.`.replace(/' '/g, '');
  const spacedSentence = await runPythonScript(sentence);
  console.log('spacedSentence: ', spacedSentence);

  const finalSentence = restoreText(spacedSentence);
  console.log('finalSentence: ', finalSentence);
  // console.log('spacedSentence: ', spacedSentence);
  // const tokenizedSentence = await runPythonScript(sentence);
  // tokenizedSentence.forEach(word => {
  //     console.log("Before: ", word,  ' isCorrect: ', checker.spell(word), ' After: ', checker.suggest(word)?.[0]);
  // });

  // sentence.split(' ').forEach(word => {
  //   console.log("Before: ", word,  ' isCorrect: ', checker.spell(word), ' After: ', checker.suggest(word)?.[0]);
  // });
}

async function initialize() {
  hunspellFactory = await loadModule();
  const affbuf = new Uint8Array(fs.readFileSync('./ko_KR.aff'));
  const dicbuf = new Uint8Array(fs.readFileSync('./ko_KR.dic'));
  checker = hunspellFactory.create(
    hunspellFactory.mountBuffer(affbuf),
    hunspellFactory.mountBuffer(dicbuf)  
  );
}

function runPythonScript(inputText) {
    return new Promise((resolve, reject) => {
        const python = spawn('python3', ['main.py']);
        let outputData = "";

        python.stdout.on('data', function (data) {
            outputData += data.toString();
        });

        python.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`);
      });

        python.on('close', (code) => {
          try {
            resolve(outputData);
            // const parsed = JSON.parse(outputData);
            // resolve(parsed);
          } catch (e) {
            console.error("JSON parsing error:", e);
          }
        });

        console.log('inputText: ',inputText)
        python.stdin.write(JSON.stringify(inputText));
        python.stdin.end();
    });
}

