function About() {
  return (
    <div className="text-2xl max-w-3xl mx-auto py-10 px-8 leading-normal font-work-sans">
      <h1 className="text-3xl">
        Welcome to <i>lila</i>! 
      </h1>
      <br></br>
      <p>
        lila was created to tackle a common challenge in standardized test
        preparation: the scarcity of practice questions. 
      </p>
      <br></br>
      <p>
        By generating unique, never-seen-before questions, lila helps test-takers
        build confidence and improve their skills.
      </p>
      <br></br>
      <p>
        As the saying goes, practice makes perfect!
      </p>
      <br></br>
      <p>
        lila was created by <a className="text-indigo-700" href="https://www.jonathanmcclement.com">Jonathan McClement</a>.
        For inquiries, email <a className="text-indigo-700" href="mailto:jmcclement13@gmail.com">jmcclement13@gmail.com</a>
      </p>
      <br></br>
      <div className="w-full mx-auto text-center">
        <a className="mx-auto text-indigo-600" href="/">
          Back
        </a>
      </div>
    </div>
  );
}

export default About;
