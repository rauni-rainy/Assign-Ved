const BASE_URL = 'https://veda-server-170572969444.us-central1.run.app';

class APIError extends Error {
  code?: number;
  constructor(message: string, code?: number) {
    super(message);
    this.code = code;
    this.name = 'APIError';
  }
}

async function fetchWithErr(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let msg = 'An error occurred';
    try {
      const data = await res.json();
      msg = data.message || data.error || msg;
    } catch {
      msg = res.statusText;
    }
    throw new APIError(msg, res.status);
  }
  return res.json();
}

export const createAssignment = (formData: FormData) => {
  return fetchWithErr(`${BASE_URL}/api/assignments`, {
    method: 'POST',
    body: formData,
  });
};

export const fetchAssignments = () => {
  return fetchWithErr(`${BASE_URL}/api/assignments`);
};

export const deleteAssignment = (id: string) => {
  return fetchWithErr(`${BASE_URL}/api/assignments/${id}`, {
    method: 'DELETE',
  });
};

export const fetchQuestionPaper = (assignmentId: string) => {
  return fetchWithErr(`${BASE_URL}/api/question-papers/${assignmentId}`);
};

export const downloadPDF = (paperId: string, showAnswers?: boolean) => {
  const url = `${BASE_URL}/api/question-papers/${paperId}/download${showAnswers ? '?includeAnswers=true' : ''}`;
  return fetch(url).then(async res => {
    if (!res.ok) throw new APIError('Failed to download PDF', res.status);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `question-paper-${paperId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
};

export const regenerate = (paperId: string) => {
  return fetchWithErr(`${BASE_URL}/api/question-papers/${paperId}/regenerate`, {
    method: 'POST',
  });
};



export const fetchPaperVersions = (assignmentId: string) => {
  return fetchWithErr(`${BASE_URL}/api/question-papers/assignment/${assignmentId}/versions`);
};

export const fetchSpecificPaper = (paperId: string) => {
  return fetchWithErr(`${BASE_URL}/api/question-papers/${paperId}/with-answers`, {
    headers: {
      'x-teacher-token': 'demo-token'
    }
  });
};
