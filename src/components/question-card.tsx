import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface QuestionCardProps {
  number: number
  question: string
  date: string
}

export function QuestionCard({ number, question, date }: QuestionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="text-sm font-medium">#{number}</div>
        <div className="text-sm text-muted-foreground">{date}</div>
      </CardHeader>
      <CardContent>
        <p className="text-lg">{question}</p>
      </CardContent>
    </Card>
  )
} 