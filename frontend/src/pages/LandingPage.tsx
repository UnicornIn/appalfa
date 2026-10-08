import { Deliverables } from '../components/landing/Deliverables';
import { Hero } from '../components/landing/Hero';
import { DoctorSection, PrivacySection, StatSection } from '../components/landing/InfoSections';
import { Journey } from '../components/landing/Journey';
import { ResumeBar } from '../components/landing/ResumeBar';
import { SiteFooter } from '../components/landing/SiteFooter';
import { Topbar } from '../components/landing/Topbar';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchQuestionnaire } from '../services/assessments';

export function LandingPage() {
  const questionnaire = useAsyncData(fetchQuestionnaire);
  const data = questionnaire.status === 'ready' ? questionnaire.data : null;

  return (
    <div id="site">
      <Topbar />
      <Hero questionnaire={questionnaire} />
      <Journey totalQuestions={data?.questions.length ?? null} />
      <Deliverables price={data?.price ?? null} />
      <StatSection />
      <PrivacySection />
      <DoctorSection />
      <SiteFooter />
      <ResumeBar />
    </div>
  );
}
