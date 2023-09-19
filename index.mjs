import { loadModule } from "hunspell-asm";
import fs from 'fs';

let hunspellFactory;
let checker;

run();

async function run () {
  await initialize();
  const sentence = '안냥 하세요, 저는 이란이런 사람입니다. 이렇게 긴문장도 제대로 체크가 될까? 문징이 밈에 안드는디 어똫케 하쥐?';
  sentence.split(' ').forEach(word => {
    console.log("Before: ", word,  ' isCorrect: ', checker.spell(word), ' After: ', checker.suggest(word)?.[0]);
  });
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






