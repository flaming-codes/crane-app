export function getFunnyPeakDownloadComment(downloads: number): string {
  const ranges = [
    {
      min: 0,
      max: 10,
      comments: [
        "A true underdog story—every download counts!",
        "Single digits, but every revolution starts with a small spark!",
        "Well, it's a start. Even the greatest papers had humble beginnings.",
      ],
    },
    {
      min: 11,
      max: 50,
      comments: [
        "A handful of downloads. Enough to fill a small classroom with curiosity!",
        "More than just a fluke! Someone out there appreciates this work.",
        "Not quite a landslide, but certainly not negligible. Keep it up!",
      ],
    },
    {
      min: 51,
      max: 100,
      comments: [
        "A respectable number—like a niche research paper, only those who truly care will download it.",
        "This number of downloads could probably be counted on one hand. Well, maybe two hands and a couple of toes.",
        "Not quite viral, but there's some loyal interest. Consider it a cult classic.",
      ],
    },
    {
      min: 101,
      max: 500,
      comments: [
        "Now we're getting somewhere! Enough downloads to populate a lively group chat.",
        "More than a random curiosity, but not quite a blockbuster. Still, it's gaining traction!",
        "Enough downloads to make a small wave in the niche community. The curiosity is spreading!",
      ],
    },
    {
      min: 501,
      max: 1000,
      comments: [
        "Not bad! The download count is somewhere between 'small-town buzz' and 'moderate academic conference'.",
        "This could be a paper that people cite without reading. Reaching the medium popularity echelon is no small feat!",
        "More downloads than an obscure whitepaper, but not enough to bring down any servers. A solid effort!",
      ],
    },
    {
      min: 1001,
      max: 5000,
      comments: [
        "Now we’re talking! This work is officially 'heard of in academic circles', just like those wild research papers on synthetic bananas.",
        "That's enough downloads to impress a room full of undergrads. A commendable achievement indeed.",
        "Consider this 'mid-tier influencer' status—if it were a TikTok, it would get a nod from nieces and nephews.",
      ],
    },
    {
      min: 5001,
      max: 10000,
      comments: [
        "A solid achievement! Enough downloads to get noticed at department meetings.",
        "That's a lot of interest! Someone might even write a blog post about it.",
        "Impressive! The kind of number that makes colleagues ask, 'How did you do it?'",
      ],
    },
    {
      min: 10001,
      max: 50000,
      comments: [
        "That's enough downloads to make it mildly famous in niche technical communities. A badge of honor!",
        "The downloads are officially high enough to crash an underfunded departmental server. Quite an accomplishment!",
        "The academic equivalent of having a dedicated subreddit. There are fans, and maybe even a few trolls!",
      ],
    },
    {
      min: 50001,
      max: 100000,
      comments: [
        "An impressive feat! Enough downloads to make even seasoned academics take note.",
        "The kind of number that gets mentioned in a keynote speech. Well done!",
        "This work is reaching a lot of screens. A significant achievement indeed!",
      ],
    },
    {
      min: 100001,
      max: 500000,
      comments: [
        "Practically an academic rockstar! That's enough downloads to cause murmurs at international conferences.",
        "That's a whole lot of downloads. Somewhere, a librarian is trying to figure out why more bandwidth is needed.",
        "This is the kind of download count that makes grant committees nod approvingly. A job well done, even the stoic reviewers might be impressed!",
      ],
    },
    {
      min: 500001,
      max: 1000000,
      comments: [
        "This is starting to look legendary. Enough downloads to inspire a dedicated panel discussion!",
        "The kind of popularity that makes other researchers envious. Truly impressive!",
        "Half a million downloads! This work is now a household name in certain academic circles.",
      ],
    },
    {
      min: 1000001,
      max: Infinity,
      comments: [
        "Whoa! That's more downloads than an AI-generated meme in a tech-savvy group chat. Truly legendary!",
        "Perhaps it's time to consider hiring a personal assistant to manage the newfound fame. That's an absurd number of downloads.",
        "This is the academic equivalent of going platinum. Except, you know, with more charts and fewer screaming fans. Congratulations!",
      ],
    },
  ];

  for (const range of ranges) {
    if (downloads >= range.min && downloads <= range.max) {
      const randomIndex = Math.floor(Math.random() * range.comments.length);
      return range.comments[randomIndex];
    }
  }

  return "An unknown quantity of downloads—a mystery worthy of academic study in itself!";
}
