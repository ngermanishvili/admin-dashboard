

export const _dbmethod = [
  {
    subscription: 'basic',
    description:"Add data to existing table without deleting current content.",
    price: 0,
    caption: 'forever',
    lists: [
      { primaryText: 'Maintain historic data', secondaryText: "Ideal when updating a table withnew records without losing data" },
      { primaryText: 'Single source of truth', secondaryText: "Useful for adding data fromdifferent sources to a single table" },
      { primaryText: 'Incremental updates', secondaryText: "Best for incremental updateswhere historical data is important" },
    ],
    labelAction: 'Append Table',
  },
  {
    subscription: 'basic',
    description:"Replace existing table with new data, deleting previous content.",
    price: 0,
    caption: 'forever',
    lists: [
      { primaryText: 'Recency prioritised', secondaryText: "Ideal for scenarios where only themost recent data is relevant." },
      { primaryText: 'Fix inconsistencies', secondaryText: "Useful when fixing data inconsistencies or errors in theexisting table." },
      { primaryText: 'Single version', secondaryText: "Best for maintaining a singleversion of the data, avoidingduplication." },
    ],
    labelAction: 'Overwrite Table',
  },
  {
    subscription: 'basic',
    description:"Generate a brand new, empty table for the generated data.",
    price: 0,
    caption: 'forever',
    lists: [
      { primaryText: 'Segregated data', secondaryText: "Ideal for scenarios where vouneed to segregate data based ondifferent criteria." },
      { primaryText: 'Separate storage', secondaryText: "Useful when working on a newproject or dataset that requiresseparate storage." },
      { primaryText: 'Siloed data', secondaryText: "Best for maintaining clear andorganized data structures in yourdatabase." },
    ],
    labelAction: 'Create new Table',
  },
  
];
