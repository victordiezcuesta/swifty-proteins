const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '..', 'assets', 'ligands.txt');
const OUTPUT = path.join(__dirname, '..', 'src', 'utils', 'ligandList.ts');
const ID_REGEX = /^[A-Za-z0-9]{1,5}$/; // identificadores tipo "ATP", "001", "HEM"

function fail(message)
{
	console.error(`[ligands] ERROR: ${message}`);
	process.exit(1); // sale antes de escribir nada: el ligandList.ts anterior queda intacto
}

if (!fs.existsSync(INPUT))
	fail(`${INPUT} not found.`);

let text;
try
{
	text = fs.readFileSync(INPUT, 'utf8');
}
catch (e)
{
	fail(`could not read ligands.txt (${e.message}).`);
}

const ligands = [];
const seen = new Set();
let duplicates = 0;

text.split(/\r?\n/).forEach((rawLine, index) =>
{
	const line = rawLine.trim();
	if (!line)
		return;

	if (!ID_REGEX.test(line))
		fail(`invalid line ${index + 1} in ligands.txt: "${line.slice(0, 30)}"`);

	if (seen.has(line))
	{
		duplicates++;
		return;
	}

	seen.add(line);
	ligands.push(line);
});

if (ligands.length === 0)
	fail('ligands.txt is empty.');

const content =
	'// AUTO-GENERATED from assets/ligands.txt. Do not edit by hand: run "make ligands".\n'
	+ 'export const LIGANDS: string[] = [\n'
	+ ligands.map(id => `\t'${id}',`).join('\n')
	+ '\n];\n';

fs.mkdirSync(path.dirname(OUTPUT), {recursive: true});
fs.writeFileSync(OUTPUT, content);

console.log(`[ligands] ${ligands.length} ligands written to src/utils/ligandList.ts`
	+ (duplicates ? ` (${duplicates} duplicates ignored)` : ''));