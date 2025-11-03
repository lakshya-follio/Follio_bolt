import { supabase } from '../App';
import React from 'react';
import { User, MapPin, Mail, Phone, Building, GraduationCap, Code, Zap, TrendingUp } from 'lucide-react';
import type { User as UserType, ParsedResumeData } from '../App';
import Header from './ui/Header';
import Footer from './ui/Footer';
import Button from './ui/Button';
import Card from './ui/Card';

interface DashboardProps {
  user: UserType | null;
  parsedData: ParsedResumeData | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, parsedData, onLogout }) => {
  const [profileData, setProfileData] = React.useState<ParsedResumeData | null>(parsedData);
  const [loading, setLoading] = React.useState(!parsedData);

  React.useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || parsedData) return;

      try {
        const { data } = await supabase.from('profiles')
          .select('resume_data')
          .eq('id', user.id)
          .maybeSingle();

        if (data?.resume_data) {
          setProfileData(data.resume_data);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, parsedData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Loading your profile...</h2>
          <p className="text-neutral-600">Just a moment</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">No profile data found</h2>
          <p className="text-neutral-600 mb-6">
            Please upload and parse your resume first.
          </p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header user={user} onLogout={onLogout} showUserMenu />

      <main className="flex-1">
        <div className="container-max section-padding">
          <div className="mb-12">
            <Card variant="elevated" padding="spacious" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full -mr-32 -mt-32 opacity-50"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white flex-shrink-0">
                  <User className="w-10 h-10" />
                </div>

                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                    {profileData.profile.name}
                  </h1>
                  <p className="text-xl text-primary-600 font-medium mb-4">
                    {profileData.profile.headline}
                  </p>

                  <div className="flex flex-wrap gap-6">
                    {profileData.profile.location && (
                      <div className="flex items-center gap-2 text-neutral-700">
                        <MapPin className="w-4 h-4 text-primary-600" />
                        <span>{profileData.profile.location}</span>
                      </div>
                    )}
                    {profileData.profile.email && (
                      <div className="flex items-center gap-2 text-neutral-700">
                        <Mail className="w-4 h-4 text-primary-600" />
                        <span>{profileData.profile.email}</span>
                      </div>
                    )}
                    {profileData.profile.phone && (
                      <div className="flex items-center gap-2 text-neutral-700">
                        <Phone className="w-4 h-4 text-primary-600" />
                        <span>{profileData.profile.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card variant="default" padding="normal">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-neutral-900">
                    {profileData.experience.length}
                  </div>
                  <div className="text-sm text-neutral-600">Work Experience</div>
                </div>
              </div>
            </Card>

            <Card variant="default" padding="normal">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-success-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-neutral-900">
                    {profileData.education.length}
                  </div>
                  <div className="text-sm text-neutral-600">Education</div>
                </div>
              </div>
            </Card>

            <Card variant="default" padding="normal">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-accent-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-neutral-900">
                    {profileData.skills.length}
                  </div>
                  <div className="text-sm text-neutral-600">Skills</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card variant="elevated" padding="normal">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-200">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900">Work Experience</h2>
              </div>

              <div className="space-y-6">
                {profileData.experience.map((exp, index) => (
                  <div key={exp.id} className="relative">
                    {index !== profileData.experience.length - 1 && (
                      <div className="absolute left-0 top-6 w-0.5 h-16 bg-primary-200"></div>
                    )}
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0"></div>
                      <div className="flex-1 pb-4">
                        <h3 className="font-semibold text-neutral-900">{exp.role}</h3>
                        <p className="text-primary-600 font-medium text-sm">{exp.company}</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          {exp.endDate && ` – ${new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
                          {!exp.endDate && ' – Present'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="elevated" padding="normal">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-200">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-success-600" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900">Education</h2>
              </div>

              <div className="space-y-6">
                {profileData.education.map((edu, index) => (
                  <div key={edu.id} className="relative">
                    {index !== profileData.education.length - 1 && (
                      <div className="absolute left-0 top-6 w-0.5 h-16 bg-success-200"></div>
                    )}
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-success-600 mt-2 flex-shrink-0"></div>
                      <div className="flex-1 pb-4">
                        <h3 className="font-semibold text-neutral-900">{edu.degree}</h3>
                        <p className="text-success-600 font-medium text-sm">{edu.school}</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          {edu.endDate && ` – ${new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card variant="elevated" padding="normal">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-200">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-accent-600" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900">Skills</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-50 to-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium border border-primary-200"
                >
                  <Zap className="w-3 h-3" />
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          <div className="mt-12 p-6 bg-gradient-to-r from-warning-50 to-error-50 rounded-2xl border border-warning-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Ready to build your portfolio?
                </h3>
                <p className="text-neutral-700 mb-4">
                  Your profile is all set! Next, customize your portfolio design and share it with the world.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="primary" size="sm">
                    Customize Portfolio
                  </Button>
                  <Button variant="secondary" size="sm">
                    Share Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
