import mongoose from "mongoose";

const user = require("@schemas/users");
const book = require("@schemas/books");

const userModel = mongoose.model("user", user.UserSchema);
const bookModel = mongoose.model("book", book.BookSchema);

const { UserRole, UserStatus } = require("../utils/enum/user");
const { BookSubject } = require("../utils/enum/book");

const bcrypt = require("bcrypt");

async function seedUser() {
  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  const adminPassword = 123456;
  const hashPassword = await bcrypt.hashSync(adminPassword.toString(), salt);
  try {
    await userModel.create({
      username: "admin",
      password: hashPassword,
      role: UserRole.Admin,
    });
  } catch (error) {
    console.log("Admin Account have been add");
  }

  // user 1
  try {
    await userModel.create({
      username: "user",
      password: hashPassword,
      phone: "0909754995",
      email: "bpropk2@gmail.com",
      name: "Binh Tran",
      dateOfBirth: "2000-12-20",
      address: "83/21 Đào Tông Nguyên",
      role: UserRole.User,
      status: UserStatus.Active,
      currentbudget: 0,
      library: [],
      lock: {
        lockCount: 0,
        lockWrongPassword: 0,
        date: new Date(),
      },
    });
  } catch (error) {
    console.log("User Account have been add");
  }

  // user 2
  try {
    await userModel.create({
      username: "user2",
      password: hashPassword,
      phone: "0913801901",
      email: "Bbinhtony@gmail.com",
      name: "Tony",
      dateOfBirth: "2000-12-20",
      address: "83/21 Đào Tông Nguyên",
      role: UserRole.User,
      status: UserStatus.Active,
      currentbudget: 0,
      library: [],
      lock: {
        lockCount: 0,
        lockWrongPassword: 0,
        date: new Date(),
      },
    });
  } catch (error) {
    console.log("User Account have been add");
  }

  // user 3
  try {
    await userModel.create({
      username: "user3",
      password: hashPassword,
      phone: "09792372302",
      email: "Pmdang@gmail.com",
      name: "Dang",
      dateOfBirth: "2000-12-20",
      address: "83/21 Đào Tông Nguyên",
      role: UserRole.User,
      status: UserStatus.Active,
      currentbudget: 0,
      library: [],
      lock: {
        lockCount: 0,
        lockWrongPassword: 0,
        date: new Date(),
      },
    });
  } catch (error) {
    console.log("User Account have been add");
  }
}

async function seedBooks() {
  // History
  try {
    await bookModel.create({
      title: "Darkwater",
      author: "W. E. B. Du Bois",
      description:
        "The distinguished American civil rights leader, Du Bois first published these fiery essays, sketches, and poems individually nearly 100 years ago in the Atlantic, the Journal of Race Development, and other periodicals. Reflecting the author’s ideas as a politician, historian, and artist, this volume has long moved and inspired readers with its militant cry for social, political, and economic reforms for black Americans. Essential reading for students of African-American history.",
      subject: BookSubject.History,
      epub: "reading-bucket/bois-darkwater(history).epub",
      illustration: "illustration/darkwater.jpg",
      price: 10.1,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "Death in the Afternoon",
      author: "Ernest Hemingway",
      description:
        "Still considered one of the best books ever written about bullfighting, this is an impassioned look at the sport by one of its true aficionados. It reflects Hemingway’s conviction that bullfighting was more than mere sport and reveals a rich source of inspiration for his art. The unrivaled drama of bullfighting, with its rigorous combination of athleticism and artistry, and its requisite display of grace under pressure, ignited Hemingway’s imagination. Here he describes and explains the technical aspects of this dangerous ritual and “the emotional and spiritual intensity and pure classic beauty that can be produced by a man, an animal, and a piece of scarlet serge draped on a stick.” Seen through his eyes, bullfighting becomes a richly choreographed ballet, with performers who range from awkward amateurs to masters of great elegance and cunning. A fascinating look at the history and grandeur of bullfighting, Death in the Afternoon is also a deeper contemplation of the nature of cowardice and bravery, sport and tragedy, and is enlivened throughout by Hemingway’s sharp commentary on life and literature.",
      subject: BookSubject.History,
      epub: "reading-bucket/hemingway-death-in-the-afternoon(history).epub",
      illustration: "illustration/death-in-the-afternoon.jpg",
      price: 14,
    });
  } catch (error) {
    console.log(error);
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "Discourses on Livy",
      author: "Niccolò Machiavelli",
      description:
        "The Discourses on the First Decade of Titus Livius is one of the masterpieces by Machiavelli. This work narrates the writer’s comments as to how a democratic government should be established. Through the comparison of Venice and Rome a detailed analysis of different kinds of governments is given. Machiavelli has ingeniously presented different aspects of his own contentions. Thought-provoking!",
      subject: BookSubject.History,
      epub: "reading-bucket/machiavelli-discourses-on-livy(history).epub",
      illustration: "illustration/discourses-on-livy.jpg",
      price: 20,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "Henry VII",
      author: "Charles Williams",
      description:
        "Henry VII is less spectacular than his descendants, but not less interesting or even exciting. The first of the Tudors has been less written about than any (except Edward VI). He supplanted a dynasty and subordinated an aristocracy; he collected a treasure and created a fleet. But he created also the engine of monarchy. He did this because his desires were never at odds with his intentions: he possessed an equilibrium greater than any other Tudor-even Elizabeth. That fixed equilibrium of his mind released a very high industry and decision. In his later life his methods a little overcame him; his suspicion, his caution, his acquisitiveness escaped control. It was then that by certain general measures and especially by one little particular act he prepared the way for the destruction of that engine of monarchy he had created. The reign of Henry VII was the seed of the future, but it was already worm-eaten.",
      subject: BookSubject.History,
      epub: "reading-bucket/williams-henry-vii(history).epub",
      illustration: "illustration/henry-vii.jpg",
      price: 29,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  // Fantasy
  try {
    await bookModel.create({
      title: "A Connecticut Yankee in King Arthur's Court",
      author: "Mark Twain",
      description:
        "In this biting satire by Twain, a 19th c. Yankee mechanic is knocked out during a brawl, and wakes to find himself in Camelot, A.D. 528, in King Arthur’s Court. When the modern mechanic tries to cure society’s ills (oppressed peasantry, evil church, etc.) with 19th c. industrial inventions like electricity and gunfire - all hell breaks loose!",
      subject: BookSubject.Fantasy,
      epub: "reading-bucket/twain-a-connecticut-yankee-in-king-arthurs-court(fantasy).epub",
      illustration:
        "illustration/twain-a-connecticut-yankee-in-king-arthurs-court.jpg",
      price: 5,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "A Dreamer's Tales",
      author: "Lord Dunsany",
      description:
        "Lord Dunsany had invented a new mythology, and his fourth book supported this to the end. He skims the cream of old and new romance, giving a concentration of all that is most strange, poetical, grotesque, and glamorous, in his tales of unknown gods, untraveled deserts, ghostly peoples, cities, and temples, and cataclysms of which no echo has heretofore been heard.",
      subject: BookSubject.Fantasy,
      epub: "reading-bucket/dunsany-a-dreamer-s-tales(fantasy).epub",
      illustration: "illustration/a-dreamer-s-tales.jpg",
      price: 8,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "Allan and the Ice Gods",
      author: "H. Rider Haggard",
      description:
        "Once more Quatermain takes the hallucinogenic drug and gets to see a previous incarnation of himself–a life he lived thousands of years ago, when he was Wi, a tribal leader during the last great ice age.",
      subject: BookSubject.Fantasy,
      epub: "reading-bucket/haggard-allan-and-the-ice-gods(fantasy).epub",
      illustration: "illustration/allan-and-the-ice-gods.jpg",
      price: 19,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "Allan's Wife",
      author: "H. Rider Haggard",
      description:
        "It may be remembered that in the last pages of his diary, written just before his death, Allan Quatermain makes allusion to his long dead wife, stating that he has written of her fully elsewhere. When his death was known, his papers were handed to myself as his literary executor. Among them I found two manuscripts, of which the following is one. The other is simply a record of events wherein Mr. Quatermain was not personally concerned - a Zulu novel, the story of which was told to him by the hero many years after the tragedy had occurred. But with this we have nothing to do at present.",
      subject: BookSubject.Fantasy,
      epub: "reading-bucket/haggard-allans-wife(fantasy).epub",
      illustration: "illustration/haggard-allans-wife.jpg",
      price: 25,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  // Biography
  try {
    await bookModel.create({
      title: "Bacon",
      author: "Charles Williams",
      description:
        "Williams’ biographical account of the life of Sir Francis Bacon was first published in 1933. He identified five major modes of thought that he believed permeated Bacon’s actions. William’s biography also includes self-reflective elements of theological discussion, which was typical of his writing style.",
      subject: BookSubject.Biography,
      epub: "reading-bucket/williams-bacon(biography).epub",
      illustration: "illustration/bacon.jpg",
      price: 14,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "John Cornelius",
      author: "Hugh Walpole",
      description:
        "Walpole, as the biographer of the life of John Cornelius, wrote a long, first person narrative of the life of a genius who could never bring his world of dreams in tune with the world of reality for himself or for those who read his books, a writer who strove desperately to produce serious novels, and who died famous and acknoledged for three slim volumes of fairy tales. Walpole wrote remantically of a character whose life was never very real, and who could not find happiness, except at odd moments because of this gulf between him and the world. Walpole’s romantic flights have realistic intermission to temper them.",
      subject: BookSubject.Biography,
      epub: "reading-bucket/walpole-john-cornelius(biography).epub",
      illustration: "illustration/john-cornelius.jpg",
      price: 27,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "Orlando",
      author: "Virginia Woolf",
      description:
        "The thrill of reading Virginia Woolf’s Orlando is the feeling of looking into a whirlpool just as something utterly extraordinary materializes for the first time: an exhilarating hallucination of surreal and beautiful images that remain in memory long after you put the book down. Orlando has it all: life, death, immortality, homoerotic desire, lesbianism, and the evanescence of time. Love, fear, solitude, death, and time-travel—the subjects float by like parasols in the rain. Orlando can be found on countless lists of the finest novels of the 20th century, and is one of Virginia Woolf’s major achievements. It is considered one of her greatest works after Mrs. Dalloway and To The Lighthouse.",
      subject: BookSubject.Biography,
      epub: "reading-bucket/woolf-orlando(biography).epub",
      illustration: "illustration/orlando.jpg",
      price: 11,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "Real Soldiers of Fortune",
      author: "Richard Harding Davis",
      description:
        "First published in 1906, this is an early biography of the Real Soldiers are Winston Spencer Churchill, Baron James Harden-Hickey, Captain Philo Norton McGriffin, General McIver and other prominent military men of Davis’ time.",
      subject: BookSubject.Biography,
      epub: "reading-bucket/davis-real-soldiers-of-fortune(biography).epub",
      illustration: "illustration/davis-real-soldiers-of-fortune.jpg",
      price: 12,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  // Adventure
  try {
    await bookModel.create({
      title: "A Daughter of the Snows",
      author: "Jack London",
      description:
        "Set in the Yukon, it tells the story of Frona Welse, a Stanford graduate and physical Valkyrie, who takes to the trail after upsetting her wealthy father’s community by her forthright manner and befriending the town’s prostitute. She is also torn between love for two suitors: Gregory St Vincent, a local man who turns out to be cowardly and treacherous; and Vance Corliss, a Yale-trained mining engineer. An adventure novel of the first order.",
      subject: BookSubject.Adventure,
      epub: "reading-bucket/london-a-daughter-of-the-snows(action&adventure).epub",
      illustration: "illustration/london-a-daughter-of-the-snows.jpg",
      price: 22,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "A Drama in the Air",
      author: "Jules Verne",
      description:
        "Amalgamating futuristic technologies and expeditions into the future, this is a scintillating collection by Verne. This short work combines sights of the future as well as bird’s eye view of the contemporary era.",
      subject: BookSubject.Adventure,
      epub: "reading-bucket/verne-a-voyage-in-a-balloon(action&adventure).epub",
      illustration: "illustration/verne-a-voyage-in-a-balloon.jpg",
      price: 14,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "Adventures Of Ulysses",
      author: " Charles Lamb",
      description:
        "Charles Lamb, an English essayist was best known for his essays of Elia and children’s book Tales from Shakespeare, shares with us the legendary Greek hero, Ulysses and his men, who encounter the dreaded Cyclops, a tribe of giant cannibals, and the treacherous Sirens.",
      subject: BookSubject.Adventure,
      epub: "reading-bucket/lamb-adventures-of-ulysses(action&adventure).epub",
      illustration: "illustration/lamb-adventures-of-ulysses.jpg",
      price: 10,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "A Final Reckoning",
      author: "G. A. Henty",
      description:
        "An exciting adventure of outlaws in the early days of the Australian gold rush, when fortunes were made and stolen, and when bush rangers and natives constituted a real and formidable danger to the settlers. “All boys will read this story with eager and unflagging interest. The episodes are in Mr. Henty’s very best vein–graphic, exciting, realistic; and, as in all Mr. Henty’s books, the tendency is to the formation of an honourable, manly, and even heroic character.”–Birmingham Post.",
      subject: BookSubject.Adventure,
      epub: "reading-bucket/henty-a-final-reckoning-illustrations(action&adventure).epub",
      illustration: "illustration/henty-a-final-reckoning.jpg",
      price: 5,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  // Romance
  try {
    await bookModel.create({
      title: "Ayesha",
      author: "H. Rider Haggard",
      description:
        "In this heart-stopping sequel to the classic novel “She,” Allan Quatermain discovers a lost kingdom in the heart of Africa, ruled by the mysterious Ayesha. A haunting story of love and enchantment that spans the centuries to defy death and time. As to be expected from Haggard, this book is full of adventure – a great avalanche, a chase by the death hounds, Ayesha’s reincarnation, and of course the ultimate battle with Kalloon…there’s even Ayesha’s meeting with her “servants” – that is shadows and ghosts from beyond and the past. Not to be missed by Haggard fans.",
      subject: BookSubject.Romance,
      epub: "reading-bucket/haggard-ayesha(romance).epub",
      illustration: "illustration/haggard-ayesha.jpg",
      price: 9,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "Ligeia",
      author: "Edgar Allan Poe",
      description:
        "Ligeia is a book written by Edgar Allan Poe and widely considered to be one of the top 100 greatest books of all time. This great novel will surely attract a whole new generation of readers. For many, Ligeia is required reading for various courses and curriculum’s. And for others who simply enjoy reading timeless pieces of classic literature, this gem by Edgar Allan Poe is highly recommended.",
      subject: BookSubject.Romance,
      epub: "reading-bucket/poe-black-cat(romance).epub",
      illustration: "illustration/poe-ligeia.jpg",
      price: 10,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "The Black Cat",
      author: "Edgar Allan Poe",
      description:
        "A study of the psychology of guilt, often paired in analysis with Poe’s ”The Tell-Tale Heart“. In both, a murderer carefully conceals his crime and believes himself unassailable, but eventually breaks down and reveals himself, impelled by a nagging reminder of his guilt. A man overcome by alcohol sinks into wild depravity, goaded by his obsession with his black cat, escalates into disaster in this classic short story written by one of the world’s most renowned horror writers.",
      subject: BookSubject.Romance,
      epub: "reading-bucket/poe-black-cat(romance).epub",
      illustration: "illustration/poe-black-cat.jpg",
      price: 19,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "The House of the Seven Gables",
      author: "Nathaniel Hawthorne",
      description:
        "The sins of one generation are visited upon another in a haunted New England mansion until the arrival of a young woman from the country breathes new air into mouldering lives and rooms. Written shortly after The Scarlet Letter, The House of the Seven Gables re-addresses the theme of human guilt in a style remarkable in both its descriptive virtuosity and its truly modern mix of fantasy and realism.",
      subject: BookSubject.Romance,
      epub: "reading-bucket/hawthorne-house-of-the-seven-gables(romance).epub",
      illustration: "illustration/hawthorne-house-of-the-seven-gables.jpg",
      price: 22,
    });
  } catch (error) {
    console.log("Book have been add");
  }
}

module.exports = {
  seedUser,
  seedBooks,
};

export {};
