"use client";
import { useState } from "react";
import FallingText from "./components/fallingtext";
import Aurora from "./components/aurora";
import GradientText from "./components/GradientText";
import BlurText from "./components/BlurText";
import ShinyText from "./components/ShinyText";
import Stepper, { Step } from "./components/Stepper";
export default function Home() {
  const [step, setStep] = useState(1);
  const [birthDate, setBirthDate] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [daysUntilBirthday, setDaysUntilBirthday] = useState(0);
  const [nextBirthday, setNextBirthday] = useState("");
  const [nDays, setNDays] = useState(0);
  const [planDate, setPlanDate] = useState("");
  const [finalPlanDate, setFinalPlanDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const last_num = 5;

  // -----------------------------------
  // 通用函数
  // -----------------------------------
  const stepAdd = () => {
    if (step === last_num) {
      setStep(1);
    } else {
      setStep(step + 1);
    }
  };

  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  // 鼠标点击
  const handleMouseClick = () => {
    if (step === 1 || step === last_num) {
      stepAdd();
    } else {
      console.log("step:", step);
    }
  };

  // 显示错误信息
  const showError = (message: string) => {
    console.log("error:", message);
    setError(message);
  };

  // -----------------------------------
  // 逻辑计算
  // -----------------------------------
  // 计算到下一个生日的天数
  const calculateDaysUntilBirthday = () => {
    if (birthDate === "" || todayDate === "") {
      showError("请 输入 出生日期 和 今天的日期");
      return;
    }
    const birthDateObj = new Date(birthDate);
    const todayDateObj = new Date(todayDate);

    let nextBirthdayDate = new Date(
      todayDateObj.getFullYear(),
      birthDateObj.getMonth(),
      birthDateObj.getDate()
    );

    if (nextBirthdayDate < todayDateObj) {
      nextBirthdayDate.setFullYear(nextBirthdayDate.getFullYear() + 1);
    }

    const diffTime: number =
      nextBirthdayDate.getTime() - todayDateObj.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setDaysUntilBirthday(diffDays);
    setNextBirthday(nextBirthdayDate.toISOString().split("T")[0]);
    stepAdd();
  };

  // 调整提前天数
  const handleIncrease = () => setNDays((prevDays) => prevDays + 1);
  const handleDecrease = () =>
    setNDays((prevDays) => (prevDays > 1 ? prevDays - 1 : 1));

  // 计算计划日期
  const calculatePlanDate = () => {
    const nextBirthdayDate = new Date(nextBirthday);
    const planDateObj = new Date(nextBirthdayDate);
    planDateObj.setDate(nextBirthdayDate.getDate() - nDays);

    const dayOfWeek = planDateObj.getDay();
    let finalPlanDateObj;

    // 如果计划日落在周末，就直接使用周末；否则根据周几做前后调整
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      finalPlanDateObj = planDateObj;
    } else if (dayOfWeek <= 2) {
      finalPlanDateObj = new Date(planDateObj);
      finalPlanDateObj.setDate(planDateObj.getDate() - (dayOfWeek + 1));
    } else {
      finalPlanDateObj = new Date(planDateObj);
      finalPlanDateObj.setDate(planDateObj.getDate() + (6 - dayOfWeek));
    }

    setPlanDate(planDateObj.toISOString().split("T")[0]);
    setFinalPlanDate(finalPlanDateObj.toISOString().split("T")[0]);
    stepAdd();
  };

  // -----------------------------------
  // 渲染页面
  // -----------------------------------
  return (
    <div
      className="relative flex h-screen w-full items-center justify-center bg-black p-4 font-sans"
      onClick={handleMouseClick}
    >
      {/* Aurora 背景 */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#00D8FF", "#7CFF67", "#00D8FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* 主体内容 */}
      <div className="relative z-10 w-screen-md w-full">
        {/* 错误提示动画 */}
        {error && (
          <FallingText
            text={error}
            highlightWords={["请", "输入", "日期"]}
            trigger="click"
            backgroundColor="transparent"
            wireframes={false}
            gravity={0.56}
            fontSize="4rem"
            mouseConstraintStiffness={0.9}
          />
        )}
        {!error && (
          <Stepper
            initialStep={1}
            onStepChange={(step) => {
              console.log(step);
            }}
            onFinalStepCompleted={() => console.log("All steps completed!")}
            backButtonText="Previous"
            nextButtonText="Next"
            stepContainerClassName=""
          >
            <Step>
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="p-8 text-center space-y-4 leading-loose"
              >
                <h1 className="mb-4 text-6xl">欢迎使用</h1>
                <h1 className="mb-4 text-6xl">生日聚会计划制定工具</h1>
                <p className="text-4xl">按任意键继续...</p>
              </GradientText>
            </Step>
            <Step>
              <div className="flex flex-col items-center justify-center text-white">
                <BlurText
                  text="请输入您的出生日期和今天的日期?!"
                  delay={150}
                  animateBy="words"
                  direction="top"
                  onAnimationComplete={handleAnimationComplete}
                  className="mb-8 text-center text-5xl"
                />
                <div className="flex flex-col space-y-6 text-2xl">
                  <label className="flex items-center space-x-4">
                    <span>出生日期:</span>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="rounded-md bg-transparent px-2 py-1 border border-gray-500 focus:outline-none"
                    />
                  </label>
                  <label className="flex items-center space-x-4">
                    <span>今天的日期:</span>
                    <input
                      type="date"
                      value={todayDate}
                      onChange={(e) => setTodayDate(e.target.value)}
                      className="rounded-md bg-transparent px-2 py-1 border border-gray-500 focus:outline-none"
                    />
                  </label>
                  <button
                    onClick={calculateDaysUntilBirthday}
                    className="mx-auto mt-4 border rounded-lg px-6 py-2"
                  >
                    <ShinyText text="继续" disabled={false} speed={2} />
                  </button>
                </div>
              </div>
            </Step>
            <Step>
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="p-8 text-center text-2xl"
              >
                <h1 className="mb-6 text-4xl font-semibold">
                  生日聚会计划制定日期
                </h1>
                <p className="mb-4 text-2xl">下次生日日期: {nextBirthday}</p>
                <p className="mb-4 text-2xl">
                  距离下次生日还有 {daysUntilBirthday} 天
                </p>
                <div className="mt-6 flex flex-col items-center space-y-4">
                  <p className="text-2xl">希望提前多少天做聚会计划:</p>
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={handleDecrease}
                      className="h-10 w-10 rounded-full border border-gray-300 text-3xl"
                    >
                      -
                    </button>
                    <p className="text-4xl">{nDays} 天</p>
                    <button
                      onClick={handleIncrease}
                      className="h-10 w-10 rounded-full border border-gray-300 text-3xl"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={calculatePlanDate}
                    className="mt-4 rounded-lg border px-6 py-2"
                  >
                    继续
                  </button>
                </div>
              </GradientText>
            </Step>
            <Step>
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="p-8 text-center text-2xl"
              >
                <h1 className="mb-4 text-4xl font-bold">
                  生日聚会计划制定结果
                </h1>
                <div className="space-y-4 leading-loose">
                  <p>下次生日日期: {nextBirthday}</p>
                  <p>距离下次生日还有 {daysUntilBirthday} 天</p>
                  <p>
                    距离下次生日前{" "}
                    <span className="font-semibold">{nDays}</span> 天的日期:
                    {planDate}
                  </p>
                  <p>预计准备制定生日计划的日期: {finalPlanDate}</p>
                </div>
                <div className="mt-6 space-x-4">
                  <button
                    onClick={() => setStep(3)}
                    className="rounded-lg border px-6 py-2"
                  >
                    重新确定
                  </button>
                  <button
                    onClick={() => setStep(5)}
                    className="rounded-lg border px-6 py-2"
                  >
                    确认并继续
                  </button>
                </div>
              </GradientText>
            </Step>
            <Step>
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="p-8 text-center text-2xl space-y-4 leading-loose"
              >
                <h1 className="mb-6 text-4xl">结束</h1>
                <p className="mb-4">
                  您的生日聚会计划制定日期为: {finalPlanDate}
                </p>
                <p>按任意键结束...</p>
              </GradientText>
            </Step>
          </Stepper>
        )}
      </div>
    </div>
  );
}
