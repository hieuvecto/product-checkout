const DefaultNamingStrategy = require('typeorm').DefaultNamingStrategy;
const snakeCase = require('typeorm/util/StringUtils').snakeCase;
const pluralize = require('pluralize');

class TypeOrmNamingStrategy extends DefaultNamingStrategy {
  tableName(className, customName) {
    return customName || pluralize(snakeCase(className));
  }

  columnName(propertyName, customName, embeddedPrefixes) {
    return (
      snakeCase(embeddedPrefixes.join('_')) +
      (customName || snakeCase(propertyName))
    );
  }

  relationName(propertyName) {
    return snakeCase(propertyName);
  }

  joinColumnName(relationName, referencedColumnName) {
    return snakeCase(
      pluralize.singular(relationName) + '_' + referencedColumnName,
    );
  }

  joinTableName(
    firstTableName,
    secondTableName,
    firstPropertyName,
    secondPropertyName,
  ) {
    return snakeCase(firstTableName + '_' + secondTableName);
  }

  joinTableColumnName(tableName, propertyName, columnName) {
    return snakeCase(
      pluralize.singular(tableName) + '_' + (columnName || propertyName),
    );
  }

  classTableInheritanceParentColumnName(
    parentTableName,
    parentTableIdPropertyName,
  ) {
    return snakeCase(
      pluralize.singular(parentTableName) + '_' + parentTableIdPropertyName,
    );
  }
}

const baseDbConfig = {
  type: 'mysql',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ['dist/**/*.model{.ts,.js}'],
  synchronize: false,
  migrationsTableName: 'migrations',
  migrations: ['dist/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  namingStrategy: new TypeOrmNamingStrategy(),
  logging: false,
};

// subscribersはDIを使うためコード内から投入する
// ORMのmaster-slave振り分け機能はSELECTがデフォルトでslaveに向かう（WITH LOCKでも）ので，バグ回避のため使わない
module.exports = [
  {
    name: 'default',
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    extra: {
      connectionLimit:
        process.env.NODE_ENV === 'production'
          ? 80
          : process.env.NODE_ENV === 'staging'
          ? 50
          : 10,
    },
    ...baseDbConfig,
  },
  {
    name: 'reader',
    host: process.env.DB_HOST_READER,
    database: process.env.DB_DATABASE,
    extra: {
      connectionLimit:
        process.env.NODE_ENV === 'production'
          ? 80
          : process.env.NODE_ENV === 'staging'
          ? 30
          : 10,
    },
    ...baseDbConfig,
  },
];
