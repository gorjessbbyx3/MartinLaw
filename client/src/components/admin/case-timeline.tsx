
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, MessageSquare, DollarSign, Clock } from "lucide-react";

interface TimelineEvent {
  id: string;
  type: 'case_created' | 'document_added' | 'communication' | 'invoice_sent' | 'court_date' | 'status_change';
  title: string;
  description?: string;
  date: string;
  status?: string;
  user?: string;
}

interface CaseTimelineProps {
  caseId: string;
  events: TimelineEvent[];
}

export function CaseTimeline({ caseId, events }: CaseTimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'case_created':
        return <Calendar className="h-4 w-4" />;
      case 'document_added':
        return <FileText className="h-4 w-4" />;
      case 'communication':
        return <MessageSquare className="h-4 w-4" />;
      case 'invoice_sent':
        return <DollarSign className="h-4 w-4" />;
      case 'court_date':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'case_created':
        return 'bg-blue-500';
      case 'document_added':
        return 'bg-green-500';
      case 'communication':
        return 'bg-purple-500';
      case 'invoice_sent':
        return 'bg-yellow-500';
      case 'court_date':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Case Timeline</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No activity yet</p>
          ) : (
            events.map((event, index) => (
              <div key={event.id} className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${getEventColor(event.type)} text-white flex-shrink-0`}>
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  )}
                  {event.status && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {event.status}
                    </Badge>
                  )}
                  {event.user && (
                    <p className="text-xs text-muted-foreground mt-1">by {event.user}</p>
                  )}
                </div>
                {index < events.length - 1 && (
                  <div className="absolute left-6 mt-8 w-px h-8 bg-gray-200" />
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
