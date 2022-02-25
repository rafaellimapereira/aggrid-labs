module.exports = {
  root: true, // Make sure eslint picks up the config at the root of the directory
  parserOptions: {
    ecmaVersion: 2020, // Use the latest ecmascript standard
    sourceType: 'module', // Allows using import/export statements
    ecmaFeatures: {
      jsx: true // Enable JSX since we're using React
    }
  },
  settings: {
    react: {
      version: 'detect' // Automatically detect the react version
    }
  },
  env: {
    browser: true, // Enables browser globals like window and document
    amd: true, // Enables require() and define() as global variables as per the amd spec.
    node: true, // Enables Node.js global variables and Node.js scoping.
    jest: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended' // Make this the last element so prettier config overrides other formatting rules
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/no-children-prop': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'prettier/prettier': [
      'error',
      {},
      {
        usePrettierrc: true
      }
    ], // Use our .prettierrc file as source
    'no-restricted-imports': ['error', '@testing-library/react', '@testing-library/react-hooks']
  },
  plugins: ['simple-import-sort'],
  overrides: [
    {
      files: 'src/**/**/*.spec.js',
      extends: ['plugin:jest/recommended', 'plugin:testing-library/react']
    },
    {
      files: ['*.stories.js'],
      rules: {
        'react/prop-types': 0
      }
    }
  ]
};
