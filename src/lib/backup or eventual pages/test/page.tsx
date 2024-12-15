'use client'
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CalendarDays,
  MapPin,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info
} from 'lucide-react';

type SectionStatus = 'open' | 'closed' | 'waitlist';
type SectionType = 'Lecture' | 'Discussion' | 'Laboratory' | 'Online';

interface Section {
  crn: string;
  type: SectionType;
  instructor: string;
  time: string;
  location: string;
  capacity: number;
  enrolled: number;
  status: SectionStatus;
  restrictions: string | null;
  waitlistCount?: number;
  notes?: string;
  instructorEmail?: string;
  deliveryMethod?: 'In Person' | 'Online' | 'Hybrid';
}

interface SectionsByType {
  [key: string]: Section[];
}

interface ModernSectionsDisplayProps {
  sections?: SectionsByType;
  onRegister?: (crn: string) => void;
  className?: string;
}

interface RegisterButtonProps {
  status: SectionStatus;
  crn: string;
  onRegister: (crn: string) => void;
}

// Sample data with various scenarios
const SAMPLE_SECTIONS: SectionsByType = {
    "Lecture": [
      {
        crn: "31456",
        type: "Lecture",
        instructor: "Dr. Jane Smith",
        time: "MWF 10:00 AM - 10:50 AM",
        location: "Siebel Center 1404",
        capacity: 120,
        enrolled: 98,
        status: "open",
        restrictions: "CS & Engineering Majors only",
        instructorEmail: "jsmith@illinois.edu",
        deliveryMethod: "In Person",
        notes: "This section includes required team projects"
      },
      {
        crn: "31457",
        type: "Lecture",
        instructor: "Dr. John Doe",
        time: "TR 11:00 AM - 12:15 PM",
        location: "Siebel Center 1320",
        capacity: 120,
        enrolled: 120,
        status: "closed",
        restrictions: null,
        instructorEmail: "jdoe@illinois.edu",
        deliveryMethod: "In Person"
      },
      {
        crn: "31458",
        type: "Lecture",
        instructor: "Prof. Sarah Wilson",
        time: "MWF 2:00 PM - 2:50 PM",
        location: "Online (Zoom)",
        capacity: 150,
        enrolled: 145,
        status: "waitlist",
        restrictions: null,
        waitlistCount: 5,
        deliveryMethod: "Online",
        notes: "Synchronous online lectures with recorded options available"
      }
    ],
    "Laboratory": [
      {
        crn: "31459",
        type: "Laboratory",
        instructor: "Alex Johnson",
        time: "M 3:00 PM - 4:50 PM",
        location: "Siebel Center 0224",
        capacity: 30,
        enrolled: 25,
        status: "open",
        restrictions: null,
        instructorEmail: "ajohnson@illinois.edu",
        deliveryMethod: "In Person"
      },
      {
        crn: "31460",
        type: "Laboratory",
        instructor: "Michael Chen",
        time: "W 1:00 PM - 2:50 PM",
        location: "Siebel Center 0222",
        capacity: 30,
        enrolled: 30,
        status: "closed",
        restrictions: null,
        deliveryMethod: "In Person"
      },
      {
        crn: "31461",
        type: "Laboratory",
        instructor: "Emma Davis",
        time: "F 9:00 AM - 10:50 AM",
        location: "Siebel Center 0220",
        capacity: 30,
        enrolled: 28,
        status: "open",
        restrictions: "CS Majors only",
        deliveryMethod: "In Person"
      }
    ],
    "Discussion": [
      {
        crn: "31462",
        type: "Discussion",
        instructor: "Robert Martinez",
        time: "T 3:00 PM - 3:50 PM",
        location: "Siebel Center 1214",
        capacity: 40,
        enrolled: 35,
        status: "open",
        restrictions: null,
        deliveryMethod: "In Person"
      },
      {
        crn: "31463",
        type: "Discussion",
        instructor: "Lisa Thompson",
        time: "R 4:00 PM - 4:50 PM",
        location: "Online (Zoom)",
        capacity: 40,
        enrolled: 40,
        status: "closed",
        restrictions: null,
        deliveryMethod: "Online",
        notes: "Interactive online discussion section"
      }
    ],
    "Online": [
      {
        crn: "31464",
        type: "Online",
        instructor: "Dr. David Kim",
        time: "Asynchronous",
        location: "Online",
        capacity: 100,
        enrolled: 85,
        status: "open",
        restrictions: null,
        deliveryMethod: "Online",
        notes: "Fully asynchronous section with flexible deadlines",
        instructorEmail: "dkim@illinois.edu"
      }
    ]
  };

const RegisterButton = ({ status, crn, onRegister }: RegisterButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      disabled={status === 'closed'}
      onClick={() => onRegister(crn)}
    >
      {status === 'waitlist' ? 'Join Waitlist' : 'Register'}
    </Button>
  );
};

interface AccordionSectionProps {
  type: string;
  count: number;
  children: React.ReactNode;
}

const AccordionSection = ({ type, count, children }: AccordionSectionProps) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={type} className="border-none">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">{type} Sections</h3>
            <Badge variant="secondary">
              {count} {count === 1 ? 'section' : 'sections'}
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 mt-2">
            {children}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const StatusBadge = ({ status, waitlistCount }: { status: SectionStatus; waitlistCount?: number }) => {
  if (status === 'open') {
    return (
      <Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/25">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Open
      </Badge>
    );
  }
  if (status === 'closed') {
    return (
      <Badge variant="destructive" className="bg-red-500/15 text-red-600 hover:bg-red-500/25">
        <XCircle className="w-3 h-3 mr-1" />
        Closed
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25">
      <AlertCircle className="w-3 h-3 mr-1" />
      Waitlist {waitlistCount ? `(${waitlistCount})` : ''}
    </Badge>
  );
};

const InfoBadge = ({ children }: { children: React.ReactNode }) => (
  <Badge variant="outline" className="text-muted-foreground">
    <Info className="w-3 h-3 mr-1" />
    {children}
  </Badge>
);

const ModernSectionsDisplay = ({
  sections = SAMPLE_SECTIONS,
  onRegister,
  className = ''
}: ModernSectionsDisplayProps) => {
  return (
    <ScrollArea className={`pr-4 rounded-lg ${className}`}>
      <div className="space-y-4">
        {Object.entries(sections).map(([type, typeSection]) => (
          <AccordionSection 
            key={type} 
            type={type} 
            count={typeSection.length}
          >
            {typeSection.map((section) => (
              <Card key={section.crn} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                      <Badge variant="outline">CRN {section.crn}</Badge>
                      <StatusBadge status={section.status} waitlistCount={section.waitlistCount} />
                      {section.deliveryMethod && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                          {section.deliveryMethod}
                        </Badge>
                      )}
                    </div>
                    <RegisterButton 
                      status={section.status}
                      crn={section.crn}
                      onRegister={onRegister || (() => {})}
                    />
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Badge variant="outline" className="flex items-center gap-2 h-auto py-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div className="flex flex-col items-start">
                        <span>{section.instructor}</span>
                        {section.instructorEmail && (
                          <span className="text-xs text-muted-foreground">{section.instructorEmail}</span>
                        )}
                      </div>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-2 h-auto py-2">
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      <span>{section.time}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-2 h-auto py-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{section.location}</span>
                    </Badge>
                  </div>

                  {/* Additional Info */}
                  {(section.restrictions || section.notes) && (
                    <div className="flex flex-wrap gap-2">
                      {section.restrictions && (
                        <InfoBadge>{section.restrictions}</InfoBadge>
                      )}
                      {section.notes && (
                        <InfoBadge>{section.notes}</InfoBadge>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </AccordionSection>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ModernSectionsDisplay;