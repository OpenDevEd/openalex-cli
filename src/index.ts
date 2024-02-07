import OpenAlex from 'openalex-sdk';

const openAlex = new OpenAlex();

(async () => {
  const result = await openAlex.works({
    search: 'openalex',
    page: 1,
    perPage: 1,
  });
  console.log(result.meta);
})();
