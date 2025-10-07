from rest_framework import serializers
from .models import Category, Lesson, Word
from django.utils import timezone

class CategorybaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class CategoryFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['user']
        
class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['id', 'word', 'meaning', 'difficulty', 'learned', 'lastStudied', 'streak']
        depth = 1
        
class LessonSerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True, required=False)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'category', 'description', 'word_count', 'difficulty', "completed", "lastStudied","score", "studyTime",'words']
        depth = 1
        
    def create(self, validated_data):
        words_data = validated_data.pop("words", [])
        lesson = Lesson.objects.create(**validated_data)
        for word_data in words_data:
            Word.objects.create(lesson=lesson, **word_data)
        
        return lesson
    
    def update(self, instance, validated_data):
        instance.lastStudied = timezone.now()
        words_data = validated_data.pop("words", None)
        
        # Update các field cơ bản của Lesson
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Nếu có words gửi lên thì xử lý
        if words_data is not None:
            # Lấy danh sách word hiện có của lesson
            existing_words = {w.id: w for w in instance.words.all()}

            for word_data in words_data:
                word_id = word_data.get("id", None)

                if word_id and word_id in existing_words:
                    # Nếu word đã tồn tại thì update
                    word = existing_words.pop(word_id)
                    for attr, value in word_data.items():
                        if attr != "id":  # tránh ghi đè id
                            setattr(word, attr, value)
                    word.save()
                else:
                    # Nếu không có id hoặc id không tồn tại thì tạo mới
                    Word.objects.create(lesson=instance, **word_data)

            # Những word còn lại trong existing_words (không được gửi lên) thì xoá
            for word in existing_words.values():
                word.delete()

        return instance
