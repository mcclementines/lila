import ActionButton from "../ActionButton"

function GREHome() {
  return (
    <>
      <div className="w-full max-w-lg mx-auto">
        <h1 className="justify-center text-center text-2xl my-8 text-gray-800 font-work-sans">Verbal</h1>
        <div className="flex flex-col justify-center space-y-2">
          <ActionButton text="Sentence Completions" link="/gre/completion" color="" />
          <ActionButton text="Sentence Equivalence" link="" color="gray" />
          <ActionButton text="Reading Comprehension" link="" color="gray" />
        </div>
        <h1 className="justify-center text-center text-2xl my-8 text-gray-800 font-work-sans">Quantitative</h1>
        <div className="flex flex-col justify-center space-y-2">
          <ActionButton text="Quantitative Comparisons" link="" color="gray" />
          <ActionButton text="Problem Solving" link="" color="gray" />
          <ActionButton text="Data Interpretation" link="" color="gray" />
        </div>
      </div>
    </>
  )
}

export default GREHome
