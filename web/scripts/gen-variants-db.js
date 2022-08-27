import fs from 'node:fs';
import path from 'node:path';

const packagesPath = path.join(process.cwd(), '..', 'crawler-py', 'data', 'packages');
const source = fs
  .readdirSync(packagesPath)
  .map((file) => ({
    file,
    data: fs.readFileSync(path.join(packagesPath, file), 'utf-8')
  }))
  .filter(({ file }) => file.endsWith('.json'))
  .map(({ data }) => JSON.parse(data))
  .flat();

/**
 *
 * @param {*} s
 * @returns
 */
function composeSlug(s) {
  return encodeURIComponent(s);
}

function sanitizeDependencies(s) {
  return (
    s &&
    s.map((s) => ({
      ...s,
      name: s.name.trim(),
      link: s.link.startsWith('https://cran.r-project.org/web/packages')
        ? `https://cran-e.com/package/${composeSlug(s.name)}`
        : s.link
    }))
  );
}

function sanitizeLinkField(s) {
  const texts = s.text.split(',');
  let tuples = [];

  const beautifyText = (text) => {
    let result = text.trim();

    if (result.startsWith('https://github')) result = 'Github';
    if (result.startsWith('https://gitlab')) result = 'Gitlab';
    if (result.startsWith('https://cran.r-project')) result = 'CRAN (legacy)';

    return result;
  };

  if (texts.length === s.links.length) {
    tuples = texts.map((text, i) => ({
      text: beautifyText(text),
      link: s.links[i]
    }));
  } else {
    tuples = [
      {
        ...s.link,
        text: beautifyText(s.text)
      }
    ];
  }

  return tuples;
}

/**
 *
 */
function generateVariants() {
  const handlers = [
    {
      name: 'db-sitemap.json',
      mapper: ({ name, date }) => [composeSlug(name), date],
      filter: ({ name }, i, acc) => acc.findIndex((item) => item.name === name) === i
    },
    {
      name: 'db-ta.json',
      mapper: ({ name }) => [name.toLowerCase(), composeSlug(name)],
      filter: ({ name }, i, acc) => acc.findIndex((item) => item.name === name) === i
    },
    {
      name: 'db-ta.test.json',
      mapper: ({ name }) => [name.toLowerCase(), composeSlug(name)],
      filter: ({ name }, i, acc) => i < 20 && acc.findIndex((item) => item.name === name) === i
    },
    {
      name: 'db-lp.json',
      mapper: ({ name, title, version }) => ({
        id: name,
        name,
        title,
        version,
        slug: composeSlug(name)
      }),
      filter: () => true
    }
  ];

  handlers.forEach(({ name, mapper, filter }) => {
    const file = path.join(process.cwd(), 'static', 'data', name);

    try {
      fs.unlinkSync(file);
    } catch (error) {
      console.warn('no existing file to delete');
    }

    fs.writeFileSync(file, JSON.stringify(source.filter(filter).map(mapper)), 'utf8');
  });
}

/**
 *
 */
function generatePackages() {
  source.forEach((item) => {
    const base = path.join(process.cwd(), 'static', 'data', 'packages');
    const file = path.join(
      process.cwd(),
      'static',
      'data',
      'packages',
      composeSlug(item.name) + '.json'
    );

    if (!fs.existsSync(base)) {
      fs.mkdirSync(base);
    }

    try {
      fs.unlinkSync(file);
    } catch (error) {
      console.warn('no existing file to delete');
    }

    const next = {
      id: item.name,
      slug: encodeURIComponent(item.name),
      ...item,
      createdAt: new Date(item.date).getTime(),
      lastScrapedAt: new Date(item.last_scraped).getTime(),
      materials: item.materials?.map((m) => {
        const getType = () => {
          switch (m.name.toLowerCase()) {
            case 'license':
              return 'license';
            case 'changelog':
            case 'news':
              return 'changelog';
            case 'citation':
              return 'citation';
            case 'download':
              return 'download';

            default:
              return 'file';
          }
        };
        return {
          ...m,
          type: getType()
        };
      }),
      macos_binaries: item.macos_binaries
        ?.map((m) => {
          if (!m.link) {
            return undefined;
          }

          const [name, cpu] = m.label.trim().split(' ');
          return {
            label: name,
            link: m.link.replace('../../..', 'https://cran.r-project.org'),
            meta: cpu.replace(':', '').replace('(', '').replace(')', '')
          };
        })
        .filter(Boolean),
      windows_binaries: item.windows_binaries
        ?.map((m) => {
          if (!m.link) {
            return undefined;
          }

          const [name, cpu] = m.label.trim().split(' ');
          const result = {
            label: name.replace(':', ''),
            link: m.link.replace('../../..', 'https://cran.r-project.org')
          };
          if (cpu) {
            result.meta = cpu.replace(':', '').replace('(', '').replace(')', '');
          }
          if (result.meta === 'not') {
            result.meta = 'No binary';
          }
          return result;
        })
        .filter(Boolean),
      old_sources: item.old_sources && {
        ...item.old_sources,
        label: item.old_sources.label.trim()
      },
      depends: sanitizeDependencies(item.depends),
      imports: sanitizeDependencies(item.imports),
      suggests: sanitizeDependencies(item.suggests),
      enhances: sanitizeDependencies(item.enhances),
      linkingto: sanitizeDependencies(item.linkingto),
      reverse_depends: sanitizeDependencies(item.reverse_depends),
      reverse_imports: sanitizeDependencies(item.reverse_imports),
      reverse_suggests: sanitizeDependencies(item.reverse_suggests),
      reverse_enhances: sanitizeDependencies(item.reverse_enhances),
      reverse_linkingto: sanitizeDependencies(item.reverse_linkingto),
      link: item.link && sanitizeLinkField(item.link)
    };

    // Delete all undefined properties
    Object.keys(next).forEach((key) => {
      if (next[key] === undefined) {
        delete next[key];
      }
    });

    fs.writeFileSync(file, JSON.stringify(next), 'utf8');
  });
}

generateVariants();
generatePackages();
