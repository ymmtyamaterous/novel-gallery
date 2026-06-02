import { db } from "./index";
import { laureatePrizes, laureates, prizes } from "./schema/app";

// Nobel Prize API (https://api.nobelprize.org/2.1/) より一部データを抜粋したスタティックシードデータ
const seedLaureates = [
  {
    id: "1",
    name: "Wilhelm Conrad Röntgen",
    nameJa: "ヴィルヘルム・コンラート・レントゲン",
    birthDate: "1845-03-27",
    deathDate: "1923-02-10",
    nationality: "German",
    biography:
      "Wilhelm Conrad Röntgen was a German mechanical engineer and physicist, who, on 8 November 1895, produced and detected electromagnetic radiation in a wavelength range known as X-rays or Röntgen rays, an achievement that earned him the inaugural Nobel Prize in Physics in 1901.",
    imageUrl: null,
  },
  {
    id: "2",
    name: "Jacobus Henricus van 't Hoff",
    nameJa: "ヤコブス・ヘンリクス・ファント・ホッフ",
    birthDate: "1852-08-30",
    deathDate: "1911-03-01",
    nationality: "Dutch",
    biography:
      "Jacobus Henricus van 't Hoff Jr. was a Dutch physical chemist. A highly influential theoretical chemist of his time, Van 't Hoff was the first winner of the Nobel Prize in Chemistry.",
    imageUrl: null,
  },
  {
    id: "3",
    name: "Emil Adolf von Behring",
    nameJa: "エミール・アドルフ・フォン・ベーリング",
    birthDate: "1854-03-15",
    deathDate: "1917-03-31",
    nationality: "German",
    biography:
      "Emil Adolf von Behring was a German physiologist who received the first Nobel Prize in Physiology or Medicine in 1901 for his work on serum therapy, especially its application against diphtheria.",
    imageUrl: null,
  },
  {
    id: "4",
    name: "Sully Prudhomme",
    nameJa: "シュリー・プリュドム",
    birthDate: "1839-03-16",
    deathDate: "1907-09-07",
    nationality: "French",
    biography:
      "René François Armand Prudhomme, who wrote under the pseudonym Sully Prudhomme, was a French poet and essayist and the first winner of the Nobel Prize in Literature in 1901.",
    imageUrl: null,
  },
  {
    id: "5",
    name: "Henry Dunant",
    nameJa: "アンリ・デュナン",
    birthDate: "1828-05-08",
    deathDate: "1910-10-30",
    nationality: "Swiss",
    biography:
      "Jean-Henry Dunant, also known as Henri Dunant, was a Swiss humanitarian, businessman and social activist. He was the founder of the Red Cross and is regarded as the father of modern humanitarian law.",
    imageUrl: null,
  },
  {
    id: "6",
    name: "Frédéric Passy",
    nameJa: "フレデリック・パッシー",
    birthDate: "1822-05-20",
    deathDate: "1912-06-12",
    nationality: "French",
    biography:
      "Frédéric Passy was a French economist and pacifist who was a leading advocate for international arbitration. He shared the first Nobel Peace Prize in 1901 with Henry Dunant.",
    imageUrl: null,
  },
  {
    id: "7",
    name: "Albert Einstein",
    nameJa: "アルベルト・アインシュタイン",
    birthDate: "1879-03-14",
    deathDate: "1955-04-18",
    nationality: "German",
    biography:
      "Albert Einstein was a German-born theoretical physicist, widely held to be one of the greatest and most influential scientists of all time. Best known for developing the theory of relativity, he also made important contributions to quantum mechanics. His mass–energy equivalence formula E = mc², which arises from relativity theory, has been called \"the world's most famous equation\".",
    imageUrl: null,
  },
  {
    id: "8",
    name: "Marie Curie",
    nameJa: "マリー・キュリー",
    birthDate: "1867-11-07",
    deathDate: "1934-07-04",
    nationality: "Polish",
    biography:
      "Maria Salomea Skłodowska-Curie, known as Marie Curie, was a Polish and naturalised-French physicist and chemist who conducted pioneering research on radioactivity. She was the first woman to win a Nobel Prize, the first person to win the Nobel Prize twice, and the only person to win the Nobel Prize in two scientific sciences.",
    imageUrl: null,
  },
  {
    id: "9",
    name: "Malala Yousafzai",
    nameJa: "マララ・ユサフザイ",
    birthDate: "1997-07-12",
    deathDate: null,
    nationality: "Pakistani",
    biography:
      "Malala Yousafzai is a Pakistani activist for female education and the youngest Nobel Prize laureate. She is known for human rights advocacy, especially the education of women and children in her native Swat Valley in Khyber Pakhtunkhwa, northwest Pakistan.",
    imageUrl: null,
  },
  {
    id: "10",
    name: "Kailash Satyarthi",
    nameJa: "カイラシュ・サティヤルティ",
    birthDate: "1954-01-11",
    deathDate: null,
    nationality: "Indian",
    biography:
      "Kailash Satyarthi is an Indian social reformer who campaigned against child labour and the exploitation of children by the carpet industry, and advocated the universal right to education.",
    imageUrl: null,
  },
  {
    id: "11",
    name: "Peter Higgs",
    nameJa: "ピーター・ヒッグス",
    birthDate: "1929-05-29",
    deathDate: "2024-04-08",
    nationality: "British",
    biography:
      "Peter Ware Higgs was a British theoretical physicist, Emeritus Professor in the University of Edinburgh, and Nobel Prize laureate for his work on the mass of subatomic particles.",
    imageUrl: null,
  },
  {
    id: "12",
    name: "François Englert",
    nameJa: "フランソワ・アングレール",
    birthDate: "1932-11-06",
    deathDate: null,
    nationality: "Belgian",
    biography:
      "François Englert is a Belgian theoretical physicist and 2013 Nobel Prize in Physics laureate. He is Professor emeritus at the Université Libre de Bruxelles (ULB), where he is a member of the Théorie des interactions fondamentales.",
    imageUrl: null,
  },
  {
    id: "13",
    name: "Toni Morrison",
    nameJa: "トニ・モリスン",
    birthDate: "1931-02-18",
    deathDate: "2019-08-05",
    nationality: "American",
    biography:
      "Toni Morrison was an American novelist. Her first novel, The Bluest Eye, was published in 1970. The critically acclaimed Song of Solomon brought her national attention and won the National Book Critics Circle Award. In 1988, Morrison won the Pulitzer Prize for Beloved. She was awarded the Nobel Prize in Literature in 1993.",
    imageUrl: null,
  },
  {
    id: "14",
    name: "Kazuo Ishiguro",
    nameJa: "カズオ・イシグロ",
    birthDate: "1954-11-08",
    deathDate: null,
    nationality: "British",
    biography:
      "Sir Kazuo Ishiguro OBE FRSA FRSL is a British novelist, screenwriter, musician, and short-story writer. He was born in Nagasaki, Japan, and moved to Britain in 1960 when he was five years old. He is one of the most celebrated contemporary fiction authors in the English-speaking world.",
    imageUrl: null,
  },
  {
    id: "15",
    name: "Paul Krugman",
    nameJa: "ポール・クルーグマン",
    birthDate: "1953-02-28",
    deathDate: null,
    nationality: "American",
    biography:
      "Paul Robin Krugman is an American economist and public intellectual, who is Distinguished Professor at the Graduate Center of the City University of New York, and a columnist for The New York Times. In 2008, Krugman was the sole recipient of the Nobel Memorial Prize in Economic Sciences for his contributions to New Trade Theory and New Economic Geography.",
    imageUrl: null,
  },
];

const seedPrizes = [
  {
    id: "p-1901-physics",
    year: 1901,
    category: "physics",
    motivation: "in recognition of the extraordinary services he has rendered by the discovery of the remarkable rays subsequently named after him",
  },
  {
    id: "p-1901-chemistry",
    year: 1901,
    category: "chemistry",
    motivation: "in recognition of the extraordinary services he has rendered by the discovery of the laws of chemical dynamics and osmotic pressure in solutions",
  },
  {
    id: "p-1901-medicine",
    year: 1901,
    category: "medicine",
    motivation: "for his work on serum therapy, especially its application against diphtheria, by which he has opened a new road in the domain of medical science and thereby placed in the hands of the physician a victorious weapon against illness and deaths",
  },
  {
    id: "p-1901-literature",
    year: 1901,
    category: "literature",
    motivation: "in special recognition of his poetic composition, which gives evidence of lofty idealism, artistic perfection and a rare combination of the qualities of both heart and intellect",
  },
  {
    id: "p-1901-peace",
    year: 1901,
    category: "peace",
    motivation: null,
  },
  {
    id: "p-1921-physics",
    year: 1921,
    category: "physics",
    motivation: "for his services to Theoretical Physics, and especially for his discovery of the law of the photoelectric effect",
  },
  {
    id: "p-1903-physics",
    year: 1903,
    category: "physics",
    motivation: "in recognition of the extraordinary services they have rendered by their joint researches on the radiation phenomena discovered by Professor Henri Becquerel",
  },
  {
    id: "p-1911-chemistry",
    year: 1911,
    category: "chemistry",
    motivation: "in recognition of her services to the advancement of chemistry by the discovery of the elements radium and polonium, by the isolation of radium and the study of the nature and compounds of this remarkable element",
  },
  {
    id: "p-2013-physics",
    year: 2013,
    category: "physics",
    motivation: "for the theoretical discovery of a mechanism that contributes to our understanding of the origin of mass of subatomic particles, and which recently was confirmed through the discovery of the predicted fundamental particle, by the ATLAS and CMS experiments at CERN's Large Hadron Collider",
  },
  {
    id: "p-1993-literature",
    year: 1993,
    category: "literature",
    motivation: "who in novels characterized by visionary force and poetic import, gives life to an essential aspect of American reality",
  },
  {
    id: "p-2017-literature",
    year: 2017,
    category: "literature",
    motivation: "who, in novels of great emotional force, has uncovered the abyss beneath our illusory sense of connection with the world",
  },
  {
    id: "p-2014-peace",
    year: 2014,
    category: "peace",
    motivation: "for their struggle against the suppression of children and young people and for the right of all children to education",
  },
  {
    id: "p-2008-economics",
    year: 2008,
    category: "economics",
    motivation: "for his analysis of trade patterns and location of economic activity",
  },
];

const seedLaureatePrizes = [
  { id: "lp-1", laureateId: "1", prizeId: "p-1901-physics", motivation: null, share: 1 },
  { id: "lp-2", laureateId: "2", prizeId: "p-1901-chemistry", motivation: null, share: 1 },
  { id: "lp-3", laureateId: "3", prizeId: "p-1901-medicine", motivation: null, share: 1 },
  { id: "lp-4", laureateId: "4", prizeId: "p-1901-literature", motivation: null, share: 1 },
  { id: "lp-5", laureateId: "5", prizeId: "p-1901-peace", motivation: null, share: 2 },
  { id: "lp-6", laureateId: "6", prizeId: "p-1901-peace", motivation: null, share: 2 },
  { id: "lp-7", laureateId: "7", prizeId: "p-1921-physics", motivation: null, share: 1 },
  {
    id: "lp-8",
    laureateId: "8",
    prizeId: "p-1903-physics",
    motivation: "in recognition of the extraordinary services they have rendered by their joint researches on the radiation phenomena discovered by Professor Henri Becquerel",
    share: 2,
  },
  {
    id: "lp-9",
    laureateId: "8",
    prizeId: "p-1911-chemistry",
    motivation: null,
    share: 1,
  },
  { id: "lp-10", laureateId: "11", prizeId: "p-2013-physics", motivation: null, share: 2 },
  { id: "lp-11", laureateId: "12", prizeId: "p-2013-physics", motivation: null, share: 2 },
  { id: "lp-12", laureateId: "13", prizeId: "p-1993-literature", motivation: null, share: 1 },
  { id: "lp-13", laureateId: "14", prizeId: "p-2017-literature", motivation: null, share: 1 },
  { id: "lp-14", laureateId: "9", prizeId: "p-2014-peace", motivation: null, share: 2 },
  { id: "lp-15", laureateId: "10", prizeId: "p-2014-peace", motivation: null, share: 2 },
  { id: "lp-16", laureateId: "15", prizeId: "p-2008-economics", motivation: null, share: 1 },
];

export async function seed() {
  console.log("Seeding database...");

  // 既にデータがある場合はスキップ
  const existing = await db.query.laureates.findFirst();
  if (existing) {
    console.log("Seed data already exists. Skipping.");
    return;
  }

  await db.insert(laureates).values(seedLaureates);
  console.log(`Inserted ${seedLaureates.length} laureates`);

  await db.insert(prizes).values(seedPrizes);
  console.log(`Inserted ${seedPrizes.length} prizes`);

  await db.insert(laureatePrizes).values(seedLaureatePrizes);
  console.log(`Inserted ${seedLaureatePrizes.length} laureate_prizes`);

  console.log("Seeding complete.");
}
