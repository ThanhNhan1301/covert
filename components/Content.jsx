import React from "react";

const error_message_invalid = "Giá trị bạn nhập không phải chữ số";
const error_message_when_null = "Bạn chưa nhập giá trị";

const list_string_numbers = [
  "không",
  "một",
  "hai",
  "ba",
  "bốn",
  "năm",
  "sáu",
  "bảy",
  "tám",
  "chín",
];

const list_units_tree_number = ["", "ngàn", "triệu", "tỉ"];

function Content() {
  const [input, setInput] = React.useState("");
  const [error, setError] = React.useState();
  const [result, setResult] = React.useState();
  const [unit, setUnit] = React.useState("đồng");
  const [uppercase, setUppercase] = React.useState(false);

  const showResult = (str) => {
    const [x, ...y] = str || "";
    return (
      <textarea
        id="copy"
        contentEditable={false}
        className={`outline-none border-none w-full bg-transparent max-h-[150px] ${
          uppercase && "uppercase"
        } first-letter:uppercase`}
        value={result}
      />
    );
  };

  const handleCopy = () => {
    const ele_copy = document.getElementById("copy");
    if (!ele_copy) return;
    ele_copy.select();
    document.execCommand("copy");
  };

  const read_tree_number = (char) => {
    switch (char.length) {
      case 1:
        return list_string_numbers[char];
      case 2:
        if (char === "10") return "mười";
        if (char[0] === "1") return `mười ${list_string_numbers[char[1]]}`;
        return `${list_string_numbers[char[0]]} mươi ${
          list_string_numbers[char[1]]
        }`;
      default:
        if (char === "100") return "một trăm";
        if (char === "110") return "một trăm mười";
        if (char[1] === "0")
          return `${list_string_numbers[char[0]]} trăm lẻ ${
            list_string_numbers[char[2]]
          }`;
        if (char[2] === "0")
          return `${list_string_numbers[char[0]]} trăm ${
            list_string_numbers[char[1]]
          } mươi`;

        return `${list_string_numbers[char[0]]} trăm${
          char[1] === "1" ? "" : " " + list_string_numbers[char[1]]
        } ${char[1] === "1" ? "mười" : "mươi"} ${
          char[2] === "1" ? "mốt" : list_string_numbers[char[2]]
        }`;
    }
  };

  const handleCovert = (char) => {
    const group_count = Math.ceil(char.length / 3);
    const first_count = char.length % 3 === 0 ? 3 : char.length % 3;
    let flag = first_count;
    const char_covert = Array(group_count)
      .fill(0)
      .map((_, index) => {
        let value;
        if (index === 0) {
          value = char.slice(0, first_count);
        } else {
          value = char.slice(flag, flag + 3);
          flag = flag + 3;
        }
        return value === "000"
          ? ""
          : `${read_tree_number(value)} ${
              list_units_tree_number[group_count - index - 1]
            }`;
      })
      .join(" ");
    setResult(char_covert);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let char = input[0] === "0" ? input.trim().replace("0", "") : input.trim();
    if (!char) return setError(error_message_when_null);
    if (isNaN(+char)) return setError(error_message_invalid);
    handleCovert(char);
  };

  const handleOnChange = (e) => {
    if (error) setError(null);
    setInput(e.target.value);
  };

  return (
    <div
      className="w-full max-w-[1200px] m-auto bg-white min-h-screen 
      flex justify-center items-center"
    >
      <form
        className="w-[90%] max-w-[400px] bg-slate-50 p-5 shadow-md"
        onSubmit={handleSubmit}
      >
        <span className="w-full text-end block">v.3.1</span>
        <h3 className="text-center font-bold text-xl text-red-300 mb-8">
          Welcome, you !!!
        </h3>
        <input
          maxLength={16}
          value={input}
          onChange={handleOnChange}
          placeholder="Nhập số tiền"
          className="w-full outline-none h-[40px] 
            border-[2px] border-slate-600 px-2 rounded-md mb-5"
        />

        <input
          maxLength={16}
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Nhập số tiền"
          className="w-full outline-none h-[40px] 
            border-[2px] border-slate-600 px-2 rounded-md mb-5"
        />
        <button
          type="submit"
          className="w-full outline-none h-[40px] 
            rounded-md bg-blue-900 uppercase text-white shadow-md"
        >
          Chuyển đổi
        </button>
        <div className="mt-4 text-red-700">{error}</div>
        <div className="mt-8 border-t-[1px] border-gray-500 pt-4 border-dashed ">
          <div
            className="flex justify-center items-center mb-5 w-[100px] m-auto gap-2 cursor-pointer"
            onClick={() => setUppercase(!uppercase)}
          >
            <div className={uppercase ? "" : "text-blue-600 font-semibold"}>
              Aa
            </div>
            <div
              className={`flex-1 flex  p-1 rounded-full bg-slate-400 ${
                uppercase && "justify-end"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-blue-600" />
            </div>
            <div className={!uppercase ? "" : "text-blue-600 font-semibold"}>
              AA
            </div>
          </div>
          <span className="text-blue-700 block">{showResult(result)}</span>
        </div>
        <button
          className="block m-auto h-9 px-10 rounded-sm shadow-md text-white uppercase bg-blue-900"
          onClick={handleCopy}
        >
          Copy
        </button>
      </form>
    </div>
  );
}

export default Content;
