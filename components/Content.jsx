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
  const [result, setResult] = React.useState("");

  let array = [];

  const read_unique_tree = (str, index) => {
    if (index == 2) {
      if (str === "0") return "lẻ";
      if (str === "1") return "mười";
    } else if (index == 3) {
      if (str === "0") return "mươi";
      if (str === "1") return "mốt";
    }
    return list_string_numbers[str];
  };

  const read_unique_tow = (str) => {
    if (str === "0") return "mươi";
    if (str === "1") return "mười";
    return list_string_numbers[str];
  };

  const read_tree_number = (number) => {
    let r = "";
    if (number == "000") return r;
    if (number == "100") return "một trăm";
    switch (number.length) {
      case 3:
        r = [
          list_string_numbers[number[0]],
          "trăm",
          read_unique_tree(number[1], 2),
          read_unique_tree(number[2], 3),
        ].join(" ");
        break;
      case 2:
        r =
          number === "10"
            ? "mười"
            : [
                list_string_numbers[number[0]],
                number[1] === "0" ? "" : "mươi",
                read_unique_tow(number[1]),
              ].join(" ");
        break;
      default:
        r = list_string_numbers[number[0]];
        break;
    }
    return r;
  };

  const handleCovert = (array) => {
    const x = list_units_tree_number;
    let result = [];
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
    array_covert.map((value) => {
      result.push(value.str, value.unit_tree);
    });

    result.push("đồng");
    setResult(result.join(" "));
  };

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
    if (isNaN(Number(input))) return setError(error_message_invalid);
    array = [];

    //Action
    setResult("");
    let test = input;
    if (test[0] === "0") {
      test.slice(0, 1);
    }
    handleSlice(test);
    setInput("");
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
          maxLength={12}
          value={input}
          onChange={(e) => {
            if (error) setError(null);
            setInput(e.target.value);
          }}
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
          <span className="text-blue-700">{result}</span>
        </div>
      </form>
    </div>
  );
}

export default Content;
