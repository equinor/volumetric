import logging

from azure.storage.file import FileService

from config import Config

logger = logging.getLogger('azure.storage')
logger.setLevel(logging.ERROR)

environment = Config.ENVIRONMENT

file_service = FileService(account_name=Config.AZURE_FILES_ACCOUNT, account_key=Config.AZURE_FILES_KEY)

if environment != 'CI':
    file_service.create_share(environment)


class AzureFilesService:
    @staticmethod
    def create_file_from_bytes(bytes_file, filename):
        file_service.create_file_from_bytes(
            share_name=environment, directory_name=None, file_name=filename, file=bytes_file)

    @staticmethod
    def download_azure_file(filename):
        return file_service.get_file_to_text(environment, None, filename)
