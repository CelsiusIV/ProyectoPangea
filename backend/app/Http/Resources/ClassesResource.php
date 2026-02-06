<?php

namespace App\Http\Resources;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassesResource extends JsonResource
{
    use SoftDeletes;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'beginDate' => $this->beginDate,
            'endDate' => $this->endDate,
            'maxStudents' => $this->maxStudents,
            'class_type' => new ClassTypeResource($this->classType),
            'bookingclass' => BookingClassResource::collection($this->whenLoaded('bookingclass'))
        ];
    }
}
