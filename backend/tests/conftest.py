import sys
import os

# Ensure backend package root is on PYTHONPATH so tests can import 'main'
ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)
