# Generated by Django 3.2.8 on 2021-10-13 18:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('kakaouser', '0002_auto_20211013_1525'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profile',
            old_name='profile_img_url',
            new_name='thumbnail_url',
        ),
    ]
