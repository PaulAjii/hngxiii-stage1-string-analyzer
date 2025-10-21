# String Analyzer API

## Overview

This backend API, built with TypeScript and NestJS, provides a robust solution for analyzing various properties of strings, filtering them based on specific criteria, and interpreting natural language queries for advanced string analysis.

## Features

- **String Property Analysis**: Calculates and stores properties such as length, palindrome status, unique character count, word count, SHA256 hash, and character frequency map for submitted strings.
- **Dynamic Filtering**: Allows filtering of analyzed strings based on length (`min_length`, `max_length`), palindrome status (`is_palindrome`), word count (`word_count`), and character presence (`contains_character`).
- **Natural Language Processing (NLP) Integration**: Processes natural language queries to derive filtering parameters, offering an intuitive way to interact with string data.
- **In-Memory Storage**: Stores analyzed strings efficiently in memory for quick retrieval and manipulation.
- **Robust Data Validation**: Leverages `class-validator` and `class-transformer` for strict payload validation and type coercion.
- **Modular Architecture**: Developed with NestJS, ensuring a scalable, maintainable, and highly organized codebase.
- **Type Safety**: Implemented in TypeScript to enhance code quality, reduce runtime errors, and improve developer experience.

## Getting Started

### Installation

To set up and run the String Analyzer API locally, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/PaulAjii/hngxiii-stage1-string-analyzer.git
    ```
2.  **Navigate to the Project Directory**:
    ```bash
    cd hngxiii-stage1-string-analyzer
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Start the Application in Development Mode**:
    ```bash
    npm run start:dev
    ```
    The application will run on `http://localhost:3000`.

## API Documentation

### Base URL

`http://localhost:3000` (or `http://localhost:[PORT]`)

### Endpoints

#### POST /strings

Analyzes a given string and stores its properties.

**Request**:

```json
{
  "value": "string"
}
```

**Required Fields**:

- `value`: `string` - The string to be analyzed. Must not be empty.

**Response**:

```json
{
  "id": "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3",
  "value": "Hello World",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3",
    "character_frequency_map": {
      "h": 1,
      "e": 1,
      "l": 3,
      "o": 2,
      "w": 1,
      "r": 1,
      "d": 1
    }
  },
  "created_at": "2023-10-27T10:00:00.000Z"
}
```

**Errors**:

- `400 Bad Request`: Invalid request body or missing `value` field.
- `409 Conflict`: String already exists in the system.
- `422 Unprocessable Entity`: Invalid data type for `value` (must be a string).

#### GET /strings?is_palindrome=true

Retrieves a list of all analyzed strings, with optional filtering capabilities.

**Request**:
Query parameters can be used to filter the results. All parameters are optional.

| Parameter            | Type      | Description                                                      | Example                |
| :------------------- | :-------- | :--------------------------------------------------------------- | :--------------------- |
| `is_palindrome`      | `boolean` | Filters strings that are (or are not) palindromes.               | `is_palindrome=true`   |
| `min_length`         | `number`  | Filters strings with length greater than or equal to this value. | `min_length=5`         |
| `max_length`         | `number`  | Filters strings with length less than or equal to this value.    | `max_length=10`        |
| `word_count`         | `number`  | Filters strings with an exact word count.                        | `word_count=2`         |
| `contains_character` | `string`  | Filters strings that contain the specified character.            | `contains_character=a` |

**Response**:

```json
{
  "data": [
    {
      "id": "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3",
      "value": "Hello World",
      "properties": {
        "length": 11,
        "is_palindrome": false,
        "unique_characters": 8,
        "word_count": 2,
        "sha256_hash": "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3",
        "character_frequency_map": {
          "h": 1,
          "e": 1,
          "l": 3,
          "o": 2,
          "w": 1,
          "r": 1,
          "d": 1
        }
      },
      "created_at": "2023-10-27T10:00:00.000Z"
    },
    {
      "id": "2c2a00057470656c6563656c656e636173747372",
      "value": "Racecar",
      "properties": {
        "length": 7,
        "is_palindrome": true,
        "unique_characters": 4,
        "word_count": 1,
        "sha256_hash": "2c2a00057470656c6563656c656e636173747372",
        "character_frequency_map": {
          "r": 2,
          "a": 2,
          "c": 2,
          "e": 1
        }
      },
      "created_at": "2023-10-27T10:05:00.000Z"
    }
  ],
  "count": 2,
  "filters_applied": {
    "is_palindrome": true
  }
}
```

**Errors**:

- `400 Bad Request`: Invalid query parameter values or types.

#### GET /strings/filter-by-natural-language?query=strings%20that%20are%20palindromic%20and%20longer%20than%205%20characters

Filters analyzed strings based on a natural language query.

**Request**:
Query parameter `query` is required.

| Parameter | Type     | Description                                                         | Example                                                         |
| :-------- | :------- | :------------------------------------------------------------------ | :-------------------------------------------------------------- |
| `query`   | `string` | A natural language phrase describing the desired string properties. | `query=strings that are palindrom and longer than 5 characters` |

**Response**:

```json
{
  "data": [
    {
      "id": "2c2a00057470656c6563656c656e636173747372",
      "value": "Racecar",
      "properties": {
        "length": 7,
        "is_palindrome": true,
        "unique_characters": 4,
        "word_count": 1,
        "sha256_hash": "2c2a00057470656c6563656c656e636173747372",
        "character_frequency_map": {
          "r": 2,
          "a": 2,
          "c": 2,
          "e": 1
        }
      },
      "created_at": "2023-10-27T10:05:00.000Z"
    }
  ],
  "count": 1,
  "interpreted_query": {
    "original": "strings that are palindrom and longer than 5 characters",
    "parsed_filters": {
      "is_palindrome": true,
      "min_length": 6
    }
  }
}
```

**Errors**:

- `400 Bad Request`: Unable to parse natural language query.
- `422 Unprocessable Entity`: Query parsed but resulted in conflicting filters (e.g., `min_length` > `max_length`).

#### GET /strings/:string_value

Retrieves the analysis data for a specific string.

**Request**:
Path parameter `string_value` is required.

| Parameter      | Type     | Description                                       | Example                    |
| :------------- | :------- | :------------------------------------------------ | :------------------------- |
| `string_value` | `string` | The actual string value to retrieve its analysis. | `string_value=Hello World` |

**Response**:

```json
{
  "id": "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3",
  "value": "Hello World",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3",
    "character_frequency_map": {
      "h": 1,
      "e": 1,
      "l": 3,
      "o": 2,
      "w": 1,
      "r": 1,
      "d": 1
    }
  },
  "created_at": "2023-10-27T10:00:00.000Z"
}
```

**Errors**:

- `404 Not Found`: String does not exist in the system.

#### DELETE /strings/:string_value

Deletes an analyzed string from the system.

**Request**:
Path parameter `string_value` is required.

| Parameter      | Type     | Description                                     | Example                    |
| :------------- | :------- | :---------------------------------------------- | :------------------------- |
| `string_value` | `string` | The actual string value to delete its analysis. | `string_value=Hello World` |

**Response**:
`204 No Content` (Successful deletion, no response body)

**Errors**:

- `404 Not Found`: String does not exist in the system.

---

## Contributing

We welcome contributions to the String Analyzer API project! To contribute:

1.  **Fork the repository**.
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `bugfix/issue-description`.
3.  **Implement your changes**, ensuring that your code adheres to the project's coding standards and passes all tests.
4.  **Write or update tests** for your changes.
5.  **Commit your changes** with clear and descriptive commit messages.
6.  **Push your branch** to your forked repository.
7.  **Open a Pull Request** to the `main` branch of the original repository, describing your changes and their benefits.

## License

This project is licensed under the [MIT License](LICENSE).

## Author Info

**Paul Ajijola**

## Badges

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-red?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![ESLint](https://img.shields.io/badge/ESLint-9.x-4B32C3?logo=eslint)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-3.x-F7B93E?logo=prettier)](https://prettier.io/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
