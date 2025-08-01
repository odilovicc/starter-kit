<template>
  <div class="file-upload-container">
    <!-- Drop Zone -->
    <div
      class="drop-zone"
      :class="{ active: isDragging, 'has-files': files.length > 0 }"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        :accept="accept"
        :multiple="multiple"
        class="hidden-input"
      />

      <div v-if="files.length === 0" class="upload-prompt">
        <svg class="upload-icon" viewBox="0 0 24 24">
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
        <p class="prompt-text">Перетащите файлы сюда или нажмите для выбора</p>
        <p class="prompt-hint">Поддерживаются: {{ acceptHint }}</p>
      </div>

      <div v-else class="files-preview">
        <div v-for="(file, index) in files" :key="index" class="file-preview">
          <div class="preview-content">
            <img
              v-if="isImage(file)"
              :src="getPreviewUrl(file)"
              alt="Preview"
              class="image-preview"
            />
            <div v-else class="file-icon">
              <svg viewBox="0 0 24 24">
                <path
                  d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
                />
              </svg>
            </div>
            <div class="file-info">
              <p class="file-name">{{ file.name }}</p>
              <p class="file-size">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          <button @click.stop="removeFile(index)" class="remove-button">
            <svg viewBox="0 0 24 24">
              <path
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: [File, Array],
  accept: {
    type: String,
    default: 'image/*',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: Boolean,
  error: String,
});

const emit = defineEmits(['update:modelValue']);

const files = ref([]);
const error = ref('');
const isDragging = ref(false);
const fileInput = ref(null);

const acceptHint = computed(() => {
  if (props.accept === 'image/*') return 'JPG, PNG, GIF';
  if (props.accept === '.pdf,.doc,.docx') return 'PDF, DOC, DOCX';
  return props.accept;
});

const isImage = (file) => {
  return file?.type?.startsWith('image/');
};

// Инициализация при монтировании
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      files.value = [];
    } else if (Array.isArray(newVal)) {
      files.value = [...newVal];
    } else {
      files.value = [newVal];
    }
  },
  { immediate: true },
);

const handleDragOver = () => {
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (e) => {
  isDragging.value = false;
  if (e.dataTransfer.files.length) {
    processFiles(e.dataTransfer.files);
  }
};

const handleFileChange = (e) => {
  if (e.target.files.length) {
    processFiles(e.target.files);
  }
};

const processFiles = (fileList) => {
  error.value = '';
  const newFiles = Array.from(fileList);

  // Проверка типа файла
  if (props.accept) {
    const acceptRegex = new RegExp(
      props.accept.replace('*', '.*').replace(/,/g, '|'),
    );

    for (const file of newFiles) {
      if (!acceptRegex.test(file.type)) {
        error.value = `Неподдерживаемый тип файла. Разрешены: ${props.accept}`;
        return;
      }
    }
  }

  if (props.multiple) {
    files.value = [...files.value, ...newFiles];
  } else {
    files.value = newFiles.slice(0, 1);
  }

  emitValue();
};

const getPreviewUrl = (file) => {
  if (file.previewUrl) return file.previewUrl;

  if (isImage(file)) {
    const reader = new FileReader();
    reader.onload = (e) => {
      file.previewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
    return '';
  }
  return '';
};

const removeFile = (index) => {
  files.value.splice(index, 1);
  emitValue();
};

const emitValue = () => {
  if (props.multiple) {
    emit('update:modelValue', [...files.value]);
  } else {
    emit('update:modelValue', files.value[0] || null);
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const triggerFileInput = () => {
  if (!props.disabled && fileInput.value) {
    fileInput.value.value = ''; // Сбрасываем значение, чтобы можно было выбирать те же файлы снова
    fileInput.value.click();
  }
};
</script>

<style scoped>
.file-upload-container {
  max-width: 500px;
  margin: 0 auto;
  font-family: 'Segoe UI', sans-serif;
}

.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  position: relative;
  background-color: #f9f9f9;
}

.drop-zone.active {
  border-color: #4a90e2;
  background-color: #f0f7ff;
}

.drop-zone.has-file {
  border-color: #e0e0e0;
  padding: 1rem;
}

.hidden-input {
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.upload-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-icon {
  width: 48px;
  height: 48px;
  fill: #4a90e2;
}

.prompt-text {
  font-size: 1.1rem;
  color: #333;
  margin: 0;
}

.prompt-hint {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.file-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.preview-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-grow: 1;
}

.image-preview {
  max-height: 60px;
  max-width: 60px;
  border-radius: 4px;
  object-fit: cover;
}

.file-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-icon svg {
  width: 40px;
  height: 40px;
  fill: #666;
}

.file-info {
  flex-grow: 1;
  text-align: left;
}

.file-name {
  margin: 0;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.file-size {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}

.remove-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  margin-left: 0.5rem;
}

.remove-button svg {
  width: 24px;
  height: 24px;
  fill: #ff4444;
}

.upload-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.upload-button:hover {
  background-color: #3a7bc8;
}

.upload-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.result-container {
  margin-top: 1rem;
  background-color: #f0fff0;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #d4edda;
}

.success-message {
  color: #155724;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.url-display {
  display: flex;
  gap: 0.5rem;
}

.url-input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
}

.copy-button {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 0.5rem;
  cursor: pointer;
}

.copy-button svg {
  width: 20px;
  height: 20px;
  fill: #666;
}

.error-message {
  color: #dc3545;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #fff3f3;
  border-radius: 4px;
  border: 1px solid #ffdddd;
}
</style>
