# ![Fireclient](https://optimind-llc.github.io/fireclient/)

![](https://img.shields.io/npm/v/react-fireclient) ![](https://img.shields.io/npm/l/react-fireclient) ![](https://img.shields.io/badge/-React-555.svg?logo=react&style=flat)

- **Declative**: By using Fireclient Query Language(FQL), you can write Firestore queries declatively.
- **Scalable**: Fireclient is designed to be used on big React applications. It'll speed up your development and keep your source code tidy event if it's scaled.
- **Simple**: Quite simple and easy to use for both of big applications and small applications.

## Installation

```
npm install --save react-fireclient
```

```
yarn add react-fireclient
```

# Examples

Here is the most simplest example:

```js
function View() {
  const [nagoya, loading, error] = useGetDoc("/cities/nagoya");
  return (
    <>
      {loading && <div>loading</div>}
      {error && <div>error</div>}
      {nagoya && <div>{nagoya.data.name}</div>}
    </>
  );
}
```

This example will get doc from "/cities/nagoya" in Firestore and render doc data.
