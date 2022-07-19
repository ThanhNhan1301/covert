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
  const [result, setResult] = React.useState("--");
  const refInput = React.useRef("");

  const read_tree_number = (number) => {
    //number = '123'
    if (number.length === 1) {
      return list_string_numbers[number];
    } else if (number.length === 2) {
      if (number[0] === "1" && number[1] === "0") {
        return `mười`;
      } else {
        if (number[0] === "1" && number[1] !== "0") {
          return `mười ${list_string_numbers[number[1]]}`;
        } else if (number[0] !== "1" && number[1] === "1") {
          return `${list_string_numbers[number[0]]} mươi mốt`;
        } else if (number[0] !== "1" && number[1] === "0") {
          return `${list_string_numbers[number[0]]} mươi`;
        } else {
          return `${list_string_numbers[number[0]]} mươi ${
            list_string_numbers[number[1]]
          }`;
        }
      }
    } else if (number.length === 3) {
      if (number[0] === "0" && number[1] === "0" && number[2] === "0") {
        return "";
      } else if (number[0] !== "0" && number[1] === "0" && number[2] === "0") {
        return `${list_string_numbers[number[0]]}`;
      } else if (number[0] !== "0" && number[1] !== "0" && number[2] === "0") {
        return `${list_string_numbers[number[0]]} trăm ${
          list_string_numbers[number[1]]
        } mươi`;
      } else if (number[0] !== "0" && number[1] === "0" && number[2] !== "0") {
        return `${list_string_numbers[number[0]]} trăm lẻ ${
          list_string_numbers[number[2]]
        }`;
      } else {
        return `${list_string_numbers[number[0]]} trăm ${
          list_string_numbers[number[1]]
        } mươi ${list_string_numbers[number[2]]}`;
      }
    }

    return r;
  };

  const handleCovert = (array) => {
    const x = list_units_tree_number;
    const result = [];
    if (x.length - array.length > 0) {
      for (let index = 0; index < x.length - array.length; index++) {
        x.pop();
      }
    }

    const array_covert = array.map(({ value }, index) => {
      const u = x[x.length - 1 - index];

      const str = read_tree_number(value);
      return {
        str,
        unit_tree: value === "000" ? "" : u,
      };
    });
    setResult("");

    array_covert.map((value) => {
      result.push(value.str, value.unit_tree);
    });

    result.push("đồng");

    setResult(result.join(" "));
  };

  const array = [];
  const handleSlice = (str) => {
    let current = str;
    let t;
    if (current.length < 3) {
      t = current;
    } else {
      t = str.slice(str.length - 3, str.length);
    }
    current = current.slice(0, -3);
    array.unshift({ value: t });

    if (current) {
      handleSlice(current);
    } else {
      handleCovert(array);
    }
  };

  const handleSubmit = (e) => {
    //Checked
    e.preventDefault();

    if (!input) return setError(error_message_when_null);

    const t = input.replaceAll(",", "");

    if (isNaN(Number(t))) return setError(error_message_invalid);
    setInput("");

    //Action

    if (t[0] === "0") {
      return setError("Số bạn nhập không được có số 0 ở vị trí đầu.");
    }
    handleSlice(t);
  };

  const showResult = (str) => {
    const [x, ...y] = str;
    return (
      <>
        <span className="uppercase">{x}</span>
        <span>{y}</span>
      </>
    );
  };

  const handleOnChange = (e) => {
    if (error) setError(null);
    refInput.current = e.target.value;
    setInput(e.target.value);
  };

  return (
    <div className="w-full max-w-[1200px] m-auto bg-white min-h-screen flex justify-center items-center">
      <form
        className="w-full max-w-[400px] bg-slate-50 p-5 shadow-md"
        onSubmit={handleSubmit}
      >
        <h3 className="text-center font-bold text-xl text-red-300 mb-8">
          Welcome, you !!!
        </h3>
        <input
          maxLength={16}
          value={input}
          onChange={handleOnChange}
          placeholder="Nhập số tiền"
          className="w-full outline-none h-[40px] border-[2px] border-slate-600 px-2 rounded-md"
        />
        <button
          type="submit"
          className="w-full mt-5 outline-none h-[40px] rounded-md bg-blue-900 uppercase text-white shadow-md"
        >
          Chuyển đổi
        </button>
        <div className="mt-4 text-red-700">{error}</div>
        <div className="mt-8 border-t-[1px] border-gray-500 pt-4 border-dashed">
          <p className="mb-4">
            Số tiền nhập:{" "}
            <span className="text-blue-500 font-semibold">
              {refInput.current}
            </span>{" "}
            VNĐ
          </p>
          <span className="text-blue-700">{showResult(result)}</span>
        </div>
      </form>
    </div>
  );
}

export default Content;
