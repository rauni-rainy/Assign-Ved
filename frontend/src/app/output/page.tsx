"use client";
import DashboardLayout from "@/components/DashboardLayout";
import DocumentWrapper from "@/components/Output/DocumentWrapper";
import PaperHeader from "@/components/Output/PaperHeader";
import PaperMeta from "@/components/Output/PaperMeta";
import QuestionList from "@/components/Output/QuestionList";
import AnswerKey from "@/components/Output/AnswerKey";

export default function OutputPage() {
  const questions = [
    { id: 1, difficulty: "Easy", text: "Define electroplating. Explain its purpose.", marks: 2 },
    { id: 2, difficulty: "Moderate", text: "What is the role of a conductor in the process of electrolysis?", marks: 2 },
    { id: 3, difficulty: "Easy", text: "Why does a solution of copper sulfate conduct electricity?", marks: 2 },
    { id: 4, difficulty: "Moderate", text: "Describe one example of the chemical effect of electric current in daily life.", marks: 2 },
    { id: 5, difficulty: "Moderate", text: "Explain why electric current is said to have chemical effects.", marks: 2 },
    { id: 6, difficulty: "Challenging", text: "How is sodium hydroxide prepared during the electrolysis of brine? Write the chemical reaction involved.", marks: 2 },
    { id: 7, difficulty: "Challenging", text: "What happens at the cathode and anode during the electrolysis of water? Name the gases evolved.", marks: 2 },
    { id: 8, difficulty: "Easy", text: "Mention the type of current used in electroplating and justify why it is used.", marks: 2 },
    { id: 9, difficulty: "Moderate", text: "What is the importance of electric current in the field of metallurgy?", marks: 2 },
    { id: 10, difficulty: "Challenging", text: "Explain with a chemical equation how copper is deposited during the electroplating of an object.", marks: 2 },
  ];

  const answers = [
    { id: 1, text: "Electroplating is the process of depositing a thin layer of metal on the surface of another metal using electric current. Its purpose is to prevent corrosion, improve appearance, or increase thickness." },
    { id: 2, text: "A conductor allows the flow of electric current, causing ions in the electrolyte to move and enabling chemical changes at electrodes." },
    { id: 3, text: "Copper sulfate solution contains free copper and sulfate ions which carry electric charge, thus conducting electricity." },
    { id: 4, text: "An example is the electroplating of silver on jewelry to prevent tarnishing." },
    { id: 5, text: "Electric current causes the movement of ions leading to chemical changes at the electrodes, hence it shows chemical effects." },
    { id: 6, text: <div>Sodium hydroxide is formed at the cathode during brine electrolysis as water gains electrons:<br/><br/>2H2O + 2e- → H2 + 2OH-<br/>Na+ + OH- → NaOH (in solution)</div> },
    { id: 7, text: <div>At the cathode: water is reduced to hydrogen gas and hydroxide ions.<br/>At the anode: water is oxidized to oxygen gas and hydrogen ions.</div> },
  ];

  return (
    <DashboardLayout 
      showGridIcon={false} 
      headerIcon="auto_awesome"
      title="Create New"
      activeTab="Home"
      primaryActionText="AI Teacher's Toolkit"
      primaryActionIcon="auto_awesome"
      primaryActionHref="#"
    >
      <DocumentWrapper aiMessage="Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:">
        <PaperHeader school="Delhi Public School, Sector-4, Bokaro" subject="English" grade="5th" />
        <PaperMeta timeAllowed="45 minutes" maxMarks="20" grade="5th" />
        <QuestionList 
          section="Section A" 
          type="Short Answer Questions" 
          instructions="Attempt all questions. Each question carries 2 marks" 
          questions={questions} 
        />
        <AnswerKey answers={answers} />
      </DocumentWrapper>
    </DashboardLayout>
  );
}
