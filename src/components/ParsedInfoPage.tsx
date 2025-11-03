import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { mockParseResume } from '../utils/resumeParser';
import type { ParsedResumeData } from '../App';
import Header from './ui/Header';
import Footer from './ui/Footer';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

interface ParsedInfoPageProps {
  uploadedFile: File | null;
  onSave: (data: ParsedResumeData) => void;
  onBack: () => void;
}

const ParsedInfoPage: React.FC<ParsedInfoPageProps> = ({
  uploadedFile,
  onSave,
  onBack
}) => {
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    experience: true,
    education: true,
    skills: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (uploadedFile) {
      setTimeout(() => {
        const mockData = mockParseResume(uploadedFile);
        setParsedData(mockData);
        setLoading(false);
      }, 2000);
    }
  }, [uploadedFile]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateProfile = (field: string, value: string) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      profile: {
        ...parsedData.profile,
        [field]: value
      }
    });
  };

  const addExperience = () => {
    if (!parsedData) return;
    const newExp = {
      id: Date.now().toString(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      highlights: []
    };
    setParsedData({
      ...parsedData,
      experience: [...parsedData.experience, newExp]
    });
  };

  const updateExperience = (id: string, field: string, value: string | string[]) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      experience: parsedData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      experience: parsedData.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    if (!parsedData) return;
    const newEdu = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      startDate: '',
      endDate: ''
    };
    setParsedData({
      ...parsedData,
      education: [...parsedData.education, newEdu]
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      education: parsedData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      education: parsedData.education.filter(edu => edu.id !== id)
    });
  };

  const addSkill = (skill: string) => {
    if (!parsedData || !skill.trim()) return;
    setParsedData({
      ...parsedData,
      skills: [...parsedData.skills, skill.trim()]
    });
  };

  const removeSkill = (index: number) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      skills: parsedData.skills.filter((_, i) => i !== index)
    });
  };

  const handleSave = async () => {
    if (parsedData) {
      setSaving(true);
      setTimeout(() => {
        setSaving(false);
        onSave(parsedData);
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Parsing your resume...
          </h2>
          <p className="text-neutral-600">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (!parsedData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Failed to parse resume
          </h2>
          <p className="text-neutral-600 mb-6">
            Please try uploading a different file
          </p>
          <Button onClick={onBack} variant="secondary">
            <ArrowLeft className="w-4 h-4" />
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header showUserMenu={false} />

      <main className="flex-1">
        <div className="container-max section-padding">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="tertiary"
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Review & Edit
                </h1>
                <p className="text-sm text-neutral-600">
                  {uploadedFile?.name}
                </p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              isLoading={saving}
              className="w-full sm:w-auto"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </Button>
          </div>

          <div className="space-y-6">
            <Card variant="elevated" padding="normal">
              <button
                onClick={() => toggleSection('profile')}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <h2 className="text-lg font-semibold text-neutral-900">
                  Profile Information
                </h2>
                {expandedSections.profile ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </button>

              {expandedSections.profile && (
                <div className="px-4 pb-4 space-y-4 border-t border-neutral-200 pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      type="text"
                      value={parsedData.profile.name}
                      onChange={(e) => updateProfile('name', e.target.value)}
                    />
                    <Input
                      label="Location"
                      type="text"
                      value={parsedData.profile.location}
                      onChange={(e) => updateProfile('location', e.target.value)}
                    />
                  </div>
                  <Input
                    label="Professional Headline"
                    type="text"
                    value={parsedData.profile.headline}
                    onChange={(e) => updateProfile('headline', e.target.value)}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      value={parsedData.profile.email}
                      onChange={(e) => updateProfile('email', e.target.value)}
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={parsedData.profile.phone}
                      onChange={(e) => updateProfile('phone', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </Card>

            <Card variant="elevated" padding="normal">
              <button
                onClick={() => toggleSection('experience')}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <h2 className="text-lg font-semibold text-neutral-900">
                  Work Experience ({parsedData.experience.length})
                </h2>
                {expandedSections.experience ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </button>

              {expandedSections.experience && (
                <div className="px-4 pb-4 border-t border-neutral-200 pt-4">
                  <div className="space-y-4 mb-4">
                    {parsedData.experience.map((exp, index) => (
                      <div
                        key={exp.id}
                        className="p-4 border border-neutral-200 rounded-lg bg-white"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-neutral-900">
                            Experience {index + 1}
                          </h3>
                          <Button
                            onClick={() => removeExperience(exp.id)}
                            variant="danger"
                            size="sm"
                            className="p-1"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <Input
                            label="Company"
                            type="text"
                            value={exp.company}
                            onChange={(e) =>
                              updateExperience(exp.id, 'company', e.target.value)
                            }
                          />
                          <Input
                            label="Role"
                            type="text"
                            value={exp.role}
                            onChange={(e) =>
                              updateExperience(exp.id, 'role', e.target.value)
                            }
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            label="Start Date"
                            type="date"
                            value={exp.startDate}
                            onChange={(e) =>
                              updateExperience(exp.id, 'startDate', e.target.value)
                            }
                          />
                          <Input
                            label="End Date"
                            type="date"
                            value={exp.endDate}
                            onChange={(e) =>
                              updateExperience(exp.id, 'endDate', e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={addExperience}
                    variant="secondary"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Experience
                  </Button>
                </div>
              )}
            </Card>

            <Card variant="elevated" padding="normal">
              <button
                onClick={() => toggleSection('education')}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <h2 className="text-lg font-semibold text-neutral-900">
                  Education ({parsedData.education.length})
                </h2>
                {expandedSections.education ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </button>

              {expandedSections.education && (
                <div className="px-4 pb-4 border-t border-neutral-200 pt-4">
                  <div className="space-y-4 mb-4">
                    {parsedData.education.map((edu, index) => (
                      <div
                        key={edu.id}
                        className="p-4 border border-neutral-200 rounded-lg bg-white"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-neutral-900">
                            Education {index + 1}
                          </h3>
                          <Button
                            onClick={() => removeEducation(edu.id)}
                            variant="danger"
                            size="sm"
                            className="p-1"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <Input
                            label="School"
                            type="text"
                            value={edu.school}
                            onChange={(e) =>
                              updateEducation(edu.id, 'school', e.target.value)
                            }
                          />
                          <Input
                            label="Degree"
                            type="text"
                            value={edu.degree}
                            onChange={(e) =>
                              updateEducation(edu.id, 'degree', e.target.value)
                            }
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            label="Start Date"
                            type="date"
                            value={edu.startDate}
                            onChange={(e) =>
                              updateEducation(edu.id, 'startDate', e.target.value)
                            }
                          />
                          <Input
                            label="End Date"
                            type="date"
                            value={edu.endDate}
                            onChange={(e) =>
                              updateEducation(edu.id, 'endDate', e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={addEducation}
                    variant="secondary"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Education
                  </Button>
                </div>
              )}
            </Card>

            <Card variant="elevated" padding="normal">
              <button
                onClick={() => toggleSection('skills')}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <h2 className="text-lg font-semibold text-neutral-900">
                  Skills ({parsedData.skills.length})
                </h2>
                {expandedSections.skills ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </button>

              {expandedSections.skills && (
                <div className="px-4 pb-4 border-t border-neutral-200 pt-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {parsedData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(index)}
                          className="hover:bg-primary-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a skill..."
                      className="form-input flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSkill((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.querySelector(
                          'input[placeholder="Add a skill..."]'
                        ) as HTMLInputElement;
                        if (input.value.trim()) {
                          addSkill(input.value);
                          input.value = '';
                        }
                      }}
                      variant="secondary"
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ParsedInfoPage;
