from pathlib import Path
import os
from dotenv import load_dotenv
import warnings
warnings.filterwarnings(
    "ignore",
    message="app_settings.*deprecated",
    category=UserWarning,
)
warnings.filterwarnings(
    "ignore",
    message="ACCOUNT_LOGIN_METHODS conflicts with ACCOUNT_SIGNUP_FIELDS",
    category=UserWarning,
)
warnings.filterwarnings(
    "ignore",
    message="ACCOUNT_LOGIN_METHODS conflicts with ACCOUNT_SIGNUP_FIELDS",
)
# ✅ Load environment variables
load_dotenv()

# --- Base Path ---
BASE_DIR = Path(__file__).resolve().parent.parent

# --- Security ---
SECRET_KEY = "123"
DEBUG = True
ALLOWED_HOSTS = []

# --- Installed Apps ---
INSTALLED_APPS = [
    # Django defaults
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",

    # Third-party
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "allauth.socialaccount.providers.github",

    # Local apps
    "users",
    "projects",
    "proposals",
    "contracts",
    "messaging",
    "channels",
    "notification_review",
]

# --- Sites Framework ---
SITE_ID = 1

# --- Middleware ---
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",

    # CORS must be high
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",

    # ✅ Required for Allauth
    "allauth.account.middleware.AccountMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# --- URL Config ---
ROOT_URLCONF = "lockdown_project.urls"

# --- Templates ---
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "lockdown_project.wsgi.application"
ASGI_APPLICATION = "backend.asgi.application"

# --- Database ---
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "postgres",
        "USER": "postgres",
        "PASSWORD": "123",
        "HOST": "localhost",
        "PORT": "5432",
    }
}

# --- Password Validation ---
AUTH_PASSWORD_VALIDATORS = []

# --- Internationalization ---
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --- Static Files ---
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

# --- REST Framework ---
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}

# --- CORS ---
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3002",
    "http://localhost:3004",
    "http://127.0.0.1:3004",
]
CORS_ALLOW_METHODS = ["DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT"]
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# --- Channels ---
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {"hosts": [("127.0.0.1", 6379)]},
    },
}

# --- Notifications ---
VAPID_PUBLIC_KEY = "123"
VAPID_PRIVATE_KEY = "123"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- Redirect URLs ---
LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"

# ✅ --- Updated Allauth Configuration ---
ACCOUNT_LOGIN_METHODS = {"username", "email"}  # replaces ACCOUNT_AUTHENTICATION_METHOD
ACCOUNT_SIGNUP_FIELDS = ["username", "email"]  # replaces old ACCOUNT_EMAIL_REQUIRED etc.
ACCOUNT_EMAIL_VERIFICATION = "none"  # disable for dev
# ACCOUNT_USERNAME_REQUIRED = True
# ACCOUNT_EMAIL_REQUIRED = True

# --- Social Login Providers ---
SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": os.getenv("SOCIAL_AUTH_GOOGLE_CLIENT_ID"),
            "secret": os.getenv("SOCIAL_AUTH_GOOGLE_SECRET"),
            "key": "",
        },
        "SCOPE": ["profile", "email"],
        "AUTH_PARAMS": {"access_type": "online"},
    },
    "github": {
        "APP": {
            "client_id": os.getenv("SOCIAL_AUTH_GITHUB_CLIENT_ID"),
            "secret": os.getenv("SOCIAL_AUTH_GITHUB_SECRET"),
            "key": "",
        },
    },
}
