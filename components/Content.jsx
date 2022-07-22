import React from "react";
import { FaCopy, FaCheck } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";

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
  const [textCopy, setTextCopy] = React.useState("");
  const [valueInput, setValueInput] = React.useState("");
  const [isCoping, setIsCoping] = React.useState(false);

  React.useEffect(() => {
    const eCopy = document.getElementById("copy");
    if (!eCopy) return;
    setTextCopy(eCopy.innerText);
  }, [result, uppercase]);

  React.useEffect(() => {
    let unsubscribe;
    if (isCoping) {
      unsubscribe = setTimeout(() => {
        setIsCoping(false);
      }, [2000]);
    }

    return () => clearTimeout(unsubscribe);
  }, [isCoping]);

  const showResult = (str) => {
    if (!str) return <></>;
    return (
      <div
        className={`w-full flex justify-between items-center bg-transparent ${
          uppercase && "uppercase"
        } gap-3`}
      >
        <p id="copy" className="flex-1 first-letter:uppercase text-purple-800">
          {`${result} ${unit}`}
        </p>
        {textCopy && isCoping ? (
          <FaCheck size={18} className="text-blue-500" />
        ) : (
          <CopyToClipboard text={textCopy} onCopy={handleOnCopy}>
            <FaCopy size={18} className="cursor-pointer text-purple-800" />
          </CopyToClipboard>
        )}
      </div>
    );
  };

  const handleOnCopy = () => {
    setIsCoping(true);
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

  const handleSplit = (text) => {
    if (!text) return;
    let char =
      text[0] === "0"
        ? text.trim().replace("0", "")
        : text.trim().trim().replaceAll(",", "").replaceAll(".", "");
    char = text.trim().replaceAll(",", "").replaceAll(".", "");
    const group_count = Math.ceil(char.length / 3);
    const first_count = char.length % 3 === 0 ? 3 : char.length % 3;
    let flag = first_count;

    const array = Array(group_count)
      .fill(0)
      .map((_, index) => {
        let value;
        if (index === 0) {
          value = char.slice(0, first_count);
        } else {
          value = char.slice(flag, flag + 3);
          flag = flag + 3;
        }

        return value;
      });

    return array;
  };

  const handleSubmit = (e) => {
    setResult("");
    e.preventDefault();
    let char =
      input[0] === "0"
        ? input.trim().replace("0", "")
        : input.trim().trim().replaceAll(",", "").replaceAll(".", "");
    if (!char) return setError(error_message_when_null);
    if (isNaN(+char)) return setError(error_message_invalid);
    handleCovert(char);
  };

  const handleOnChange = (e) => {
    if (error) setError(null);
    const value = e.target.value;
    setInput(value);
    setValueInput(handleSplit(value));
  };

  return (
    <div
      className="w-full max-w-[1200px] m-auto bg-white min-h-screen 
      flex justify-center items-center"
    >
      <form
        className="w-[90%] max-w-[400px] bg-slate-50 p-5 shadow-md pb-8"
        onSubmit={handleSubmit}
      >
        <span className="w-full text-end block underline text-red-500">
          v.3.1
        </span>
        <h3 className="text-center font-bold text-xl text-red-300 mb-8">
          Welcome, you !!!
        </h3>
        <input
          maxLength={16}
          value={valueInput}
          onChange={handleOnChange}
          placeholder="Nhập chữ số bạn muốn chuyển"
          className="w-full outline-none h-[40px] 
            border-[2px] border-slate-600 px-2 rounded-md mb-5"
        />

        <input
          maxLength={16}
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Nhập đơn vị (nếu có)"
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
            onClick={() => {
              setUppercase(!uppercase);
            }}
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
          <div
            className="w-full flex px-2 items-center min-h-[40px] 
            border-[1px] border-purple-800 border-dashed rounded-md"
          >
            {result ? (
              showResult(result)
            ) : (
              <span className="text-purple-400">Kết quả</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Content;
