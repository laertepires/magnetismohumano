import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Home() {
  const questions = [
    {
      number: 1,
      question:
        "De que forma o magnetismo humano influencia o equilíbrio energético e emocional das pessoas em tratamentos terapêuticos?",
      date: "2024-03-20",
    },
    {
      number: 2,
      question:
        "Quais são os principais benefícios físicos, emocionais e espirituais que uma pessoa pode obter através da prática regular do magnetismo humano?",
      date: "2024-03-19",
    },
    {
      number: 3,
      question:
        "Existe alguma preparação mental, emocional ou espiritual que uma pessoa deva fazer antes de aplicar passes magnéticos em outra pessoa?",
      date: "2024-03-18",
    },
    {
      number: 4,
      question:
        "Como diferenciar os efeitos do magnetismo humano daqueles gerados por outras práticas terapêuticas como reiki ou terapias vibracionais?",
      date: "2024-03-17",
    },
    {
      number: 5,
      question:
        "O desenvolvimento da sensibilidade magnética pode ser treinado por qualquer pessoa, ou existem pré-disposições naturais para isso?",
      date: "2024-03-16",
    },
    {
      number: 6,
      question:
        "De que maneira os pensamentos, as emoções e a intenção do magnetizador influenciam diretamente na qualidade e eficácia da aplicação magnética?",
      date: "2024-03-15",
    },
    {
      number: 7,
      question:
        "Quais são os cuidados éticos e energéticos que um magnetizador deve ter ao realizar atendimentos ou tratamentos magnéticos?",
      date: "2024-03-14",
    },
    {
      number: 8,
      question:
        "O magnetismo humano pode ser utilizado no auxílio de tratamentos de doenças físicas, emocionais e espirituais? Existem limitações?",
      date: "2024-03-13",
    },
    {
      number: 9,
      question:
        "Como funciona o processo de transmissão, captação e emissão dos fluidos magnéticos entre o magnetizador e o receptor durante um passe?",
      date: "2024-03-12",
    },
    {
      number: 10,
      question:
        "Quais são os principais sinais que indicam que uma pessoa está recebendo adequadamente os efeitos de uma aplicação de magnetismo humano?",
      date: "2024-03-11",
    },
    {
      number: 11,
      question:
        "Existe alguma contraindicação para a prática do magnetismo humano em determinadas situações de saúde física ou mental?",
      date: "2024-03-10",
    },
    {
      number: 12,
      question:
        "Como a ciência moderna tem estudado e compreendido os efeitos do magnetismo humano? Existem pesquisas ou evidências sobre isso?",
      date: "2024-03-09",
    },
    {
      number: 13,
      question:
        "Quais são as diferenças fundamentais entre o magnetismo espiritual, o magnetismo humano e o chamado magnetismo animal?",
      date: "2024-03-08",
    },
    {
      number: 14,
      question:
        "De que maneira os ambientes influenciam na eficácia dos passes magnéticos, e como preparar um espaço energeticamente adequado?",
      date: "2024-03-07",
    },
    {
      number: 15,
      question:
        "Quais são as práticas recomendadas para manter o equilíbrio energético do próprio magnetizador, evitando desgaste ou contaminação fluídica?",
      date: "2024-03-06",
    },
  ];

  return (
    <div className="min-h-screen flex mt-2">
      <div className="w-full max-w-3xl">
        <div className="space-y-6 w-full">
          {questions.map((q) => (
            <a href="/post/teste" key={q.number} className="block mb-5 bg-white">
              <h2 className="text-lg font-100 mb-0">
                {q.number}. {q.question}
              </h2>
              <div>
                <span className="text-sm text-gray-500 pr-2">{q.date}</span>
                {"·"}
                <span className="text-sm text-gray-500 pl-2">1 comentário</span>
              </div>
            </a>
          ))}
          <Pagination className="mb-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#">Anterior</PaginationPrevious>
              </PaginationItem>
              
              <PaginationItem>
                <PaginationNext href="#">Proximo</PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
