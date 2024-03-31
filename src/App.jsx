import { useEffect, useState } from "react";
import { tenureData } from "./utils/constants";
import "./App.css";
import { numberWithCommas } from "./utils/config";
import TextInput from "./componets/text-input";
import SliderInput from "./componets/slider-input";

function App() {
  const [cost, setCost] = useState(0);
  const [interest, setInterest] = useState(10);
  const [fee, setFee] = useState(1);
  const [downPayment, setDownPayment] = useState(0);
  const [tenure, setTenure] = useState(12);
  const [emi, setEmi] = useState(0);

  const calculateEMI = (downPayment) => {
    if (!cost) return;

    const loanAmt = cost - downPayment;
    const rateOfInterest = interest / 100;
    const numOfYears = tenure / 12;
    const EMI =
      (loanAmt * rateOfInterest * (1 + rateOfInterest) ** numOfYears) /
      ((1 + rateOfInterest) ** numOfYears - 1);
    return Number(EMI / 12).toFixed(0);
  };

  const calculateDP = (emi) => {
    if (!cost) return;

    const downPayment = 100 - (emi / calculateEMI(0)) * 100;
    return Number((downPayment / 100) * cost).toFixed(0);
  };

  useEffect(() => {
    if (!(cost > 0)) {
      setDownPayment(0);
      setEmi(0);
    }
    const emi = calculateEMI(downPayment);
    setEmi(emi);
  }, [tenure]);

  const updateEMI = (e) => {
    if (!cost) return;

    const dp = Number(e.target.value);
    setDownPayment(dp.toFixed(0));

    const emi = calculateEMI(dp);
    setEmi(emi);
  };

  const updateDownPayment = (e) => {
    if (!cost) return;

    const emi = Number(e.target.value);
    setEmi(emi.toFixed(0));

    const dp = calculateDP(emi);
    setDownPayment(dp);
  };
  const totalDownPayment = () => {
    return numberWithCommas(
      (Number(downPayment) + (cost - downPayment) * (fee / 100)).toFixed(0)
    );
  };

  const totalEMI = () => {
    return numberWithCommas((emi * tenure).toFixed(0));
  };

  const setFeeWithValidation = (value) => {
    if (value <= 100) {
      setFee(value);
    } else {
      alert("Fee cannot be greater than 100");
    }
  };

  const setInterestWithValidation = (value) => {
    if (value <= 100) {
      setInterest(value);
    } else {
      alert("Interest cannot be greater than 100");
    }
  };

  

  return (
    <div className="App">
      <span className="title" style={{ fontSize: 30, margine: 10 }}>
        Emi Calculator
      </span>
      <TextInput
        title={"Total Cost of Asset"}
        state={cost}
        setState={setCost}
      />

<TextInput
        title={"Interest Rate (in %)"}
        state={interest}
        setState={setInterestWithValidation}
      />
      <TextInput
        title={"Processing Fee (in %)"}
        state={fee}
        setState={setFeeWithValidation}
      />

  <SliderInput
        title="Down Payment"
        underlineTitle={`Total Down Payment - ${totalDownPayment()}`}
        onChange={updateEMI}
        state={downPayment}
        min={0}
        max={cost}
        labelMin={"0%"}
        labelMax={"100%"}
      />

      <SliderInput
        title="Loan per Month"
        underlineTitle={`Total Loan Amount - ${totalEMI()}`}
        onChange={updateDownPayment}
        state={emi}
        min={calculateEMI(cost)}
        max={calculateEMI(0)}
      />


      <span className="title">Tenure</span>
      <div className="tenurecontainer">
        {tenureData.map((data) => {
          return (
            <button
              className={`tenure ${data === tenure ? "selected" : ""}`}
              onClick={() => setTenure(data)}
            >
              {data}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default App;
