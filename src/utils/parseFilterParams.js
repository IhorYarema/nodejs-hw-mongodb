export const parseFilterParams = (query) => {
  const { isFavourite, type } = query;

  const parsedFilter = {};

  if (isFavourite === 'true' || isFavourite === 'false') {
    parsedFilter.isFavourite = isFavourite === 'true';
  }

  if (type) {
    parsedFilter.contactType = type;
  }

  return parsedFilter;
};
