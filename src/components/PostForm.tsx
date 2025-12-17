import { useState, FormEvent } from 'react';
import './PostForm.css';

interface PostFormData {
  title: string;
  body: string;
  userId: number;
}

interface PostFormProps {
  onSubmit: (post: Omit<PostFormData, 'userId'> & { userId: number; id: number }) => void;
}

interface FormErrors {
  title?: string;
  body?: string;
}

function PostForm({ onSubmit }: PostFormProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    body: '',
    userId: 1,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ title: boolean; body: boolean }>({
    title: false,
    body: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'title':
        if (!value.trim()) {
          return 'Title is required';
        }
        if (value.trim().length < 3) {
          return 'Title must be at least 3 characters';
        }
        if (value.trim().length > 100) {
          return 'Title must not exceed 100 characters';
        }
        break;
      case 'body':
        if (!value.trim()) {
          return 'Body is required';
        }
        if (value.trim().length < 10) {
          return 'Body must be at least 10 characters';
        }
        if (value.trim().length > 500) {
          return 'Body must not exceed 500 characters';
        }
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      title: validateField('title', formData.title),
      body: validateField('body', formData.body),
    };
    setErrors(newErrors);
    return !newErrors.title && !newErrors.body;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setTouched({ title: true, body: true });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newPost = {
        ...formData,
        id: Date.now(),
      };

      onSubmit(newPost);

      // Reset form
      setFormData({ title: '', body: '', userId: 1 });
      setErrors({});
      setTouched({ title: false, body: false });
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', body: '', userId: 1 });
    setErrors({});
    setTouched({ title: false, body: false });
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <div className="form-container">
        <button
          className="add-post-button"
          onClick={() => setShowForm(true)}
        >
          <span className="button-icon">+</span>
          Add New Post
        </button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="post-form" noValidate>
        <h2 className="form-title">Create New Post</h2>

        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.title && touched.title ? 'error' : ''}`}
            placeholder="Enter post title"
            disabled={isSubmitting}
          />
          {errors.title && touched.title && (
            <span className="error-message">{errors.title}</span>
          )}
          <div className="character-count">
            {formData.title.length}/100
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="body" className="form-label">
            Body *
          </label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={4}
            className={`form-textarea ${errors.body && touched.body ? 'error' : ''}`}
            placeholder="Enter post content"
            disabled={isSubmitting}
          />
          {errors.body && touched.body && (
            <span className="error-message">{errors.body}</span>
          )}
          <div className="character-count">
            {formData.body.length}/500
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="userId" className="form-label">
            User ID
          </label>
          <input
            type="number"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, userId: Number(e.target.value) }))
            }
            className="form-input"
            min="1"
            max="10"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="button button-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button button-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="button-spinner"></span>
                Creating...
              </>
            ) : (
              'Create Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
